import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { UsersService } from './users.service';

type AuthedRequest = Request & { user?: { userId: string } };

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return req.user;
  }

  @Post('kyc/submit')
  @UseGuards(JwtAuthGuard)
  async submitKyc(@Req() req: AuthedRequest, @Body() body: { documentUrl: string }) {
    return this.users.submitKyc(req.user!.userId, body.documentUrl);
  }

  @Patch('pickup-address')
  @UseGuards(JwtAuthGuard)
  async updatePickup(
    @Req() req: AuthedRequest,
    @Body()
    body: {
      label?: string;
      street?: string;
      city?: string;
      country?: string;
      latitude: number;
      longitude: number;
    },
  ) {
    return this.users.updatePickupAddress(req.user!.userId, body);
  }
}

