import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from './jwt.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtAuthModule, PassportModule, UsersModule],
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

