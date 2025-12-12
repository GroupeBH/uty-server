import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ListingsModule } from './listings/listings.module';
import { MediaModule } from './media/media.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryModule } from './delivery/delivery.module';
import { AuctionsModule } from './auctions/auctions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RealtimeModule } from './realtime/realtime.module';
import { SearchModule } from './search/search.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './cache/redis.module';
import { S3Module } from './media/s3.module';
import { ShopsModule } from './shops/shops.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    EventBusModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ListingsModule,
    MediaModule,
    CartModule,
    OrdersModule,
    DeliveryModule,
    AuctionsModule,
    NotificationsModule,
    RealtimeModule,
    SearchModule,
    S3Module,
    ShopsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
