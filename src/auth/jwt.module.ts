import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const parseExpiresIn = (raw: string): number => {
          const match = /^(\d+)([smhd])?$/.exec(raw);
          if (!match) return Number(raw) || 86400;
          const value = Number(match[1]);
          const unit = match[2];
          switch (unit) {
            case 's':
              return value;
            case 'm':
              return value * 60;
            case 'h':
              return value * 60 * 60;
            case 'd':
            default:
              return value * 60 * 60 * 24;
          }
        };

        const raw = config.get<string>('JWT_EXPIRES_IN', '1d');
        const expiresIn = parseExpiresIn(raw);

        return {
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtAuthModule {}

