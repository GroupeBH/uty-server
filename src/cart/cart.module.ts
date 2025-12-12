import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { Listing, ListingSchema } from '../listings/schemas/listing.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Listing.name, schema: ListingSchema },
    ]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}

