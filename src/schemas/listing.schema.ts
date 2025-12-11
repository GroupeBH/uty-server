import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ListingDocument = HydratedDocument<Listing>;

@Schema({ timestamps: true })
export class Listing {
  @Prop({ type: String, ref: 'User', required: true })
  sellerId!: string;

  @Prop({ type: String, ref: 'Category', required: true })
  categoryId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true, default: 0 })
  stock!: number;

  @Prop({ type: Object, default: {} })
  attributes?: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  mediaIds?: string[];

  @Prop({ default: 'draft' })
  status!: 'draft' | 'published' | 'moderation';

  @Prop({ type: String, ref: 'Auction', required: false })
  auctionId?: string;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);

