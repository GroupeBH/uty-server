import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from './jwt.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtAuthModule, PassportModule],
  providers: [JwtStrategy],
})
export class AuthModule {}

