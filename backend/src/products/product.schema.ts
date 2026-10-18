import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ enum: ['pink', 'blue', 'grey', 'golden', 'king'], required: true }) variety: string;
  @Prop() description: string;
  @Prop({ required: true, min: 0 }) pricePerKg: number;
  @Prop({ default: 0, min: 0 }) stockKg: number;
  @Prop() imageUrl: string;
  @Prop({ default: true }) active: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
