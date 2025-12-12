import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { randomUUID } from 'node:crypto';
import { AppEvent } from './events';

export type EventEnvelope<TPayload = unknown> = {
  id: string;
  event: AppEvent;
  version: number;
  occurredAt: string;
  data: TPayload;
};

@Injectable()
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventBusService.name);
  private connection?: AmqpConnectionManager;
  private channel?: ChannelWrapper;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.getOrThrow<string>('RABBITMQ_URL');
    this.connection = connect([url]);
    this.channel = this.connection.createChannel({
      json: true,
    });
    this.channel.addSetup((ch) => ch.assertExchange('uty.events', 'topic', { durable: true }));
    this.channel.on('connect', () => this.logger.log('RabbitMQ connected'));
    this.channel.on('close', () => this.logger.warn('RabbitMQ channel closed'));
    this.channel.on('error', (err) => this.logger.error('RabbitMQ channel error', err));
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  async emit<TPayload = unknown>(event: AppEvent, payload: TPayload, version = 1): Promise<void> {
    if (!this.channel) {
      this.logger.warn(`Emit skipped, channel not ready for event ${event}`);
      return;
    }
    const envelope: EventEnvelope<TPayload> = {
      id: randomUUID(),
      event,
      version,
      occurredAt: new Date().toISOString(),
      data: payload,
    };
    await this.channel.publish('uty.events', event, envelope);
    this.logger.debug(`Emit event ${event}`, envelope as Record<string, unknown>);
  }

  subscribe<TPayload = unknown>(
    event: AppEvent,
    handler: (payload: TPayload, envelope: EventEnvelope<TPayload>) => Promise<void> | void,
  ): void {
    if (!this.channel) {
      this.logger.warn(`Subscribe skipped, channel not ready for event ${event}`);
      return;
    }
    this.channel.addSetup((ch) =>
      Promise.all([
        ch.assertExchange('uty.events', 'topic', { durable: true }),
        ch.assertQueue(`uty.${event}`, { durable: true }),
        ch.bindQueue(`uty.${event}`, 'uty.events', event),
        ch.consume(
          `uty.${event}`,
          async (msg) => {
            if (!msg) return;
            const envelope = JSON.parse(msg.content.toString()) as EventEnvelope<TPayload>;
            try {
              await handler(envelope.data, envelope);
              ch.ack(msg);
            } catch (err) {
              this.logger.error(`Handler error for ${event}`, err as Error);
              ch.nack(msg, false, false);
            }
          },
          { noAck: false },
        ),
      ]),
    );
  }
}

