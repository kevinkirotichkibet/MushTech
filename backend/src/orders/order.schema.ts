import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) product: Types.ObjectId;
  @Prop() name: string;
  @Prop() qtyKg: number;
  @Prop() unitPrice: number;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true }) customerName: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) address: string;
  @Prop({ type: [OrderItemSchema], required: true }) items: OrderItem[];
  @Prop({ required: true }) total: number;
  @Prop({ enum: ['pending', 'confirmed', 'delivered', 'cancelled'], default: 'pending' }) status: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
