import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

type AuthedRequest = Request & { user?: { userId: string } };

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: AuthedRequest) {
    return this.cartService.getCart(req.user!.userId);
  }

  @Post('items')
  async addItem(@Req() req: AuthedRequest, @Body() body: { listingId: string; qty: number }) {
    return this.cartService.addItem(req.user!.userId, body.listingId, body.qty);
  }

  @Patch('items/:listingId')
  async updateQty(
    @Req() req: AuthedRequest,
    @Param('listingId') listingId: string,
    @Body() body: { qty: number },
  ) {
    return this.cartService.updateQty(req.user!.userId, listingId, body.qty);
  }

  @Delete('items/:listingId')
  async removeItem(@Req() req: AuthedRequest, @Param('listingId') listingId: string) {
    return this.cartService.removeItem(req.user!.userId, listingId);
  }
}

