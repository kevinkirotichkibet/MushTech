import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
    @InjectModel(Product.name) private products: Model<ProductDocument>,
  ) {}

  async create(dto: CreateOrderDto) {
    const items = [];
    const reserved: { id: string; qty: number }[] = [];
    try {
      for (const line of dto.items) {
        // atomic stock decrement: only succeeds if enough stock remains
        const p = await this.products.findOneAndUpdate(
          { _id: line.productId, active: true, stockKg: { $gte: line.qtyKg } },
          { $inc: { stockKg: -line.qtyKg } },
          { new: true },
        );
        if (!p) throw new BadRequestException(`Insufficient stock or unavailable product: ${line.productId}`);
        reserved.push({ id: line.productId, qty: line.qtyKg });
        items.push({ product: p._id, name: p.name, qtyKg: line.qtyKg, unitPrice: p.pricePerKg });
      }
    } catch (e) {
      // roll back any stock already reserved
      await Promise.all(reserved.map((r) => this.products.updateOne({ _id: r.id }, { $inc: { stockKg: r.qty } })));
      throw e;
    }
    const total = +items.reduce((s, i) => s + i.qtyKg * i.unitPrice, 0).toFixed(2);
    return this.orders.create({ ...dto, items, total });
  }

  findAll() { return this.orders.find().sort({ createdAt: -1 }); }

  async setStatus(id: string, status: string) {
    const o = await this.orders.findByIdAndUpdate(id, { status }, { new: true });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }
}
