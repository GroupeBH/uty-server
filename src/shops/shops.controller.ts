import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

type AuthedRequest = Request & { user?: { userId: string } };

@Controller('shops')
export class ShopsController {
  constructor(private readonly shops: ShopsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: AuthedRequest, @Body() dto: CreateShopDto) {
    return this.shops.create(req.user!.userId, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  myShops(@Req() req: AuthedRequest) {
    return this.shops.findMine(req.user!.userId);
  }

  @Get()
  listPublic() {
    return this.shops.findPublic();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Req() req: AuthedRequest, @Body() dto: UpdateShopDto) {
    return this.shops.update(req.user!.userId, id, dto);
  }
}

