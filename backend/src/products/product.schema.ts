import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

// own collection name so this shop never touches other apps that share the same MongoDB database
@Schema({ timestamps: true, collection: 'shop_products' })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ enum: ['oyster', 'button', 'pink', 'blue', 'grey', 'golden', 'king'], required: true }) variety: string;
  @Prop() description: string;
  @Prop({ required: true, min: 0 }) pricePerKg: number;
  @Prop({ default: 0, min: 0 }) stockKg: number;
  @Prop() imageUrl: string;
  @Prop({ default: true }) active: boolean;
  // shown in the shop but cannot be ordered yet
  @Prop({ default: false }) comingSoon: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
