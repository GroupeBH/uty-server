import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeliveryDocument = HydratedDocument<Delivery>;

class DeliveryLocation {
  @Prop({ required: true })
  lat!: number;

  @Prop({ required: true })
  lng!: number;

  @Prop({ required: true })
  ts!: number;
}

const DeliveryLocationSchema = SchemaFactory.createForClass(DeliveryLocation);

@Schema({ timestamps: true })
export class Delivery {
  @Prop({ type: String, ref: 'Order', required: true })
  orderId!: string;

  @Prop({ type: String, ref: 'User', required: false })
  courierId?: string;

  @Prop({ required: true, default: 'pending' })
  status!: 'pending' | 'assigned' | 'picked' | 'in_transit' | 'completed';

  @Prop({ type: [DeliveryLocationSchema], default: [] })
  tracking?: DeliveryLocation[];

  @Prop({ required: false })
  eta?: number;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

