import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CategoryAttribute } from '../category.types';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  slug?: string;

  @Prop({ type: String, ref: 'Category', default: null })
  parentId?: string | null;

  @Prop({ type: Number, default: 0 })
  level?: number; // 0 root, 1 child, etc.

  @Prop({ type: Array, default: [] })
  attributes?: CategoryAttribute[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ parentId: 1 });
CategorySchema.index({ slug: 1 }, { unique: true, sparse: true });

