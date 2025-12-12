import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true })
export class Media {
  @Prop({ type: String, ref: 'Listing', required: false })
  listingId?: string;

  @Prop({ type: [String], required: true })
  urls!: string[];

  @Prop({ required: true })
  type!: 'image' | 'video';

  @Prop({ default: 'pending' })
  moderationStatus!: 'pending' | 'approved' | 'rejected';

  @Prop({ type: Object, default: {} })
  moderationMeta?: Record<string, unknown>;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

