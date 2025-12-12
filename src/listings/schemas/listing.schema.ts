import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ListingDocument = HydratedDocument<Listing>;

@Schema({ timestamps: true })
export class Listing {
  @Prop({ type: String, ref: 'User', required: true })
  sellerId!: string;

  @Prop({ type: String, ref: 'Category', required: true })
  categoryId!: string;

  @Prop({ type: String, ref: 'Category', required: false })
  subCategoryId?: string;

  @Prop({ default: 'product' })
  type!: 'product' | 'service';

  @Prop({ type: String, required: false })
  shopId?: string; // future shop/boutique entity

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: false, default: 0 })
  stock!: number; // for product; services may keep 0

  @Prop({ type: Object, default: {} })
  attributes?: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  mediaIds?: string[];

  @Prop({ default: 'draft' })
  status!: 'draft' | 'published' | 'moderation' | 'disabled';

  @Prop({ type: String, ref: 'Auction', required: false })
  auctionId?: string;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);

ListingSchema.index({ categoryId: 1 });
ListingSchema.index({ subCategoryId: 1 });
ListingSchema.index({ sellerId: 1 });

