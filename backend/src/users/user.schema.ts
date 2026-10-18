import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// own collection name so this shop never touches other apps that share the same MongoDB database
@Schema({ timestamps: true, collection: 'shop_users' })
export class User {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string;
  // never returned unless explicitly selected
  @Prop({ required: true, select: false }) passwordHash: string;
  @Prop({ enum: ['customer', 'admin'], default: 'customer' }) role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
