import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { Body, Patch } from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type AuthedRequest = Request & { user?: { userId: string } };

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Req() req: AuthedRequest) {
    return this.orders.listForBuyer(req.user!.userId);
  }

  @Get('seller')
  listSeller(@Req() req: AuthedRequest) {
    return this.orders.listForSeller(req.user!.userId);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.orders.getById(id, req.user!.userId);
  }

  @Post('checkout')
  checkout(@Req() req: AuthedRequest) {
    return this.orders.checkout(req.user!.userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Req() req: AuthedRequest, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, req.user!.userId, dto.status);
  }
}

