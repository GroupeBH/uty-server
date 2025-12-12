import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, ref: 'User', required: true })
  userId!: string;

  @Prop({ required: true })
  type!: string;

  @Prop({ type: Object, default: {} })
  payload?: Record<string, unknown>;

  @Prop({ required: false })
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

