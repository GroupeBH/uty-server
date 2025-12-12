import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuctionDocument = HydratedDocument<Auction>;

class Bid {
  @Prop({ type: String, ref: 'User', required: true })
  bidderId!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  ts!: number;
}

const BidSchema = SchemaFactory.createForClass(Bid);

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: String, ref: 'Listing', required: true })
  listingId!: string;

  @Prop({ required: true })
  startPrice!: number;

  @Prop({ required: true })
  minIncrement!: number;

  @Prop({ required: true })
  endTime!: Date;

  @Prop({ required: false })
  buyNow?: number;

  @Prop({ required: true, default: 'active' })
  status!: 'active' | 'ended' | 'cancelled';

  @Prop({ type: [BidSchema], default: [] })
  bids?: Bid[];

  @Prop({ required: false })
  winnerId?: string;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

