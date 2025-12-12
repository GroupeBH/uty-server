import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

type AuthedRequest = Request & { user?: { userId: string; roles?: string[] } };

@Controller('listings')
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.listings.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateListingDto, @Req() req: AuthedRequest) {
    const sellerId = req.user?.userId;
    return this.listings.create(dto, sellerId!);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
    @Req() req: AuthedRequest,
  ) {
    const sellerId = req.user?.userId;
    return this.listings.update(id, sellerId!, dto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Param('id') id: string, @Req() req: AuthedRequest) {
    const sellerId = req.user?.userId;
    return this.listings.publish(id, sellerId!);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivate(@Param('id') id: string, @Req() req: AuthedRequest) {
    const sellerId = req.user?.userId;
    return this.listings.deactivate(id, sellerId!);
  }
}

