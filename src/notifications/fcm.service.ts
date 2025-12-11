import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

type FcmMessage = {
  to: string;
  notification?: { title?: string; body?: string };
  data?: Record<string, string>;
};

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);
  private readonly serverKey?: string;

  constructor(config: ConfigService) {
    this.serverKey = config.get<string>('FCM_SERVER_KEY');
  }

  async send(message: FcmMessage): Promise<void> {
    if (!this.serverKey) {
      this.logger.warn('FCM_SERVER_KEY not set, skip send');
      return;
    }
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${this.serverKey}`,
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`FCM send failed: ${res.status} ${text}`);
    }
  }
}

