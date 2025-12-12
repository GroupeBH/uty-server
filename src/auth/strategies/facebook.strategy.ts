import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService, private readonly auth: AuthService) {
    super({
      clientID: config.get<string>('FACEBOOK_APP_ID') ?? '',
      clientSecret: config.get<string>('FACEBOOK_APP_SECRET') ?? '',
      callbackURL: config.get<string>('FACEBOOK_CALLBACK_URL') ?? '',
      profileFields: ['id', 'emails', 'displayName'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value;
    return this.auth.loginWithProvider('facebook', providerId, undefined, email);
  }
}

