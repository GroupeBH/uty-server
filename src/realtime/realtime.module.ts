import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeEventsBridge } from './realtime.events-bridge';
import { EventBusModule } from '../event-bus/event-bus.module';

@Module({
  imports: [EventBusModule],
  providers: [RealtimeGateway, RealtimeEventsBridge],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}

