import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]), UsersModule],
  providers: [ShopsService],
  controllers: [ShopsController],
})
export class ShopsModule {}

