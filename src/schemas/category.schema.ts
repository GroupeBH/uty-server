import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: String, ref: 'Category', default: null })
  parentId?: string | null;

  @Prop({ type: Object, default: {} })
  attributes?: Record<string, unknown>; // dynamic attributes definition
}

export const CategorySchema = SchemaFactory.createForClass(Category);

