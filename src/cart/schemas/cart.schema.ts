import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

class CartItem {
  @Prop({ type: String, ref: 'Listing', required: true })
  listingId!: string;

  @Prop({ required: true })
  qty!: number;

  @Prop({ required: true })
  priceSnapshot!: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: String, ref: 'User', required: true, unique: true })
  userId!: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items!: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

