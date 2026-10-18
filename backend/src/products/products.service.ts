import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}

  findAll(variety?: string) {
    return this.model.find({ active: true, ...(variety && { variety }) }).sort({ name: 1 });
  }
  async findOne(id: string) {
    const p = await this.model.findById(id);
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }
  create(dto: CreateProductDto) { return this.model.create(dto); }
  async update(id: string, dto: UpdateProductDto) {
    const p = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }
  async remove(id: string) {
    const p = await this.model.findByIdAndDelete(id);
    if (!p) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}
