import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: String, ref: 'User', required: true })
  ownerId!: string;

  @Prop({ required: false })
  logoUrl?: string;

  @Prop({ default: 'active' })
  status!: 'active' | 'suspended';
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

ShopSchema.index({ ownerId: 1 });

