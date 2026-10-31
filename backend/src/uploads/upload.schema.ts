import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UploadDocument = HydratedDocument<Upload>;

// Product photos are stored in MongoDB so they survive redeploys on hosts with temporary disks (like Render's free tier).
@Schema({ timestamps: true, collection: 'shop_images' })
export class Upload {
  @Prop({ required: true }) data: Buffer;
  @Prop({ required: true }) contentType: string;
  @Prop() size: number;
}
export const UploadSchema = SchemaFactory.createForClass(Upload);
