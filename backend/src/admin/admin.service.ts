import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/order.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { User, UserDocument } from '../users/user.schema';
import { buildStats } from './stats';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
    @InjectModel(Product.name) private products: Model<ProductDocument>,
    @InjectModel(User.name) private users: Model<UserDocument>,
  ) {}

  async stats() {
    const [orders, customers, products] = await Promise.all([
      this.orders.find().sort({ createdAt: -1 }).lean(),
      this.users.countDocuments({ role: 'customer' }),
      this.products.find({ active: { $ne: false } }).sort({ stockKg: 1 }).lean(),
    ]);
    return buildStats(orders as any, {
      customers,
      stock: products.map((p) => ({ name: p.name, stockKg: p.stockKg, comingSoon: !!p.comingSoon })),
      // set SHOP_UTC_OFFSET_MINUTES (e.g. 180) so "today" matches the shop's local day
      offsetMinutes: Number(process.env.SHOP_UTC_OFFSET_MINUTES || 0),
    });
  }

  async customers() {
    const [users, orders] = await Promise.all([
      this.users.find({ role: 'customer' }).sort({ createdAt: -1 }).lean(),
      this.orders.find({ status: { $ne: 'cancelled' } }).select('user total').lean(),
    ]);
    const agg = new Map<string, { orders: number; spent: number }>();
    for (const o of orders) {
      const k = String(o.user);
      const cur = agg.get(k) ?? { orders: 0, spent: 0 };
      cur.orders++; cur.spent += o.total;
      agg.set(k, cur);
    }
    return users.map((u) => {
      const a = agg.get(String(u._id));
      return {
        id: String(u._id), name: u.name, email: u.email, createdAt: (u as any).createdAt,
        orders: a?.orders ?? 0, spent: +(a?.spent ?? 0).toFixed(2),
      };
    });
  }
}
