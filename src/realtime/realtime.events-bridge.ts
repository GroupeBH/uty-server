import { Injectable, OnModuleInit } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { EventBusService } from '../event-bus/event-bus.service';
import { EVENTS } from '../event-bus/events';

@Injectable()
export class RealtimeEventsBridge implements OnModuleInit {
  constructor(
    private readonly gateway: RealtimeGateway,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit(): void {
    const forward = (event: string) => (payload: unknown) =>
      this.gateway.broadcast(event, payload);

    this.eventBus.subscribe(EVENTS.stockUpdated, forward(EVENTS.stockUpdated));
    this.eventBus.subscribe(EVENTS.stockReserved, forward(EVENTS.stockReserved));
    this.eventBus.subscribe(EVENTS.stockReleased, forward(EVENTS.stockReleased));

    this.eventBus.subscribe(EVENTS.auctionBidPlaced, forward(EVENTS.auctionBidPlaced));
    this.eventBus.subscribe(EVENTS.auctionEnded, forward(EVENTS.auctionEnded));

    this.eventBus.subscribe(
      EVENTS.deliveryLocationUpdated,
      forward(EVENTS.deliveryLocationUpdated),
    );
    this.eventBus.subscribe(EVENTS.deliveryAssigned, forward(EVENTS.deliveryAssigned));
  }
}

