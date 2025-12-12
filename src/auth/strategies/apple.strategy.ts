import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-apple';
import { AuthService } from '../auth.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(config: ConfigService, private readonly auth: AuthService) {
    const clientID = config.get<string>('APPLE_CLIENT_ID') ?? '';
    const teamID = config.get<string>('APPLE_TEAM_ID') ?? '';
    const keyID = config.get<string>('APPLE_KEY_ID') ?? '';
    const privateKey = config.get<string>('APPLE_PRIVATE_KEY') ?? '';
    super({
      clientID,
      teamID,
      keyID,
      key: privateKey,
      callbackURL: config.get<string>('APPLE_CALLBACK_URL') ?? '',
      scope: ['name', 'email'],
      passReqToCallback: false,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const providerId = profile.id;
    const email = profile.email;
    return this.auth.loginWithProvider('apple', providerId, undefined, email);
  }
}

