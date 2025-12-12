import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

class OrderItem {
  @Prop({ type: String, ref: 'Listing', required: true })
  listingId!: string;

  @Prop({ required: true })
  qty!: number;

  @Prop({ required: true })
  price!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, ref: 'User', required: true })
  buyerId!: string;

  @Prop({ type: String, ref: 'User', required: true })
  sellerId!: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items!: OrderItem[];

  @Prop({ required: true, default: 'created' })
  status!: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @Prop({ required: false })
  paymentMethod?: string;

  @Prop({ type: Object, default: {} })
  deliveryInfo?: Record<string, unknown>;

  @Prop({ required: false })
  stockReservationId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

