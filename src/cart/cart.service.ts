import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Listing } from '../listings/schemas/listing.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
  ) {}

  private readonly logger = new Logger(CartService.name);

  private async getOrCreateCart(userId: string) {
    const existing = await this.cartModel.findOne({ userId }).exec();
    if (existing) return existing;
    const created = new this.cartModel({ userId, items: [] });
    return created.save();
  }

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).lean<Cart>().exec();
    if (cart) return cart;
    const created = await this.getOrCreateCart(userId);
    return created.toObject() as Cart;
  }

  async addItem(userId: string, listingId: string, qty: number) {
    if (qty <= 0) throw new Error('qty must be > 0');
    const listing = await this.listingModel.findById(listingId).lean<Listing>().exec();
    if (!listing || listing.status !== 'published')
      throw new NotFoundException('Listing not available');

    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find((i) => i.listingId === listingId);
    if (existing) {
      existing.qty += qty;
      existing.priceSnapshot = listing.price;
    } else {
      cart.items.push({ listingId, qty, priceSnapshot: listing.price } as any);
    }
    await cart.save();
    this.logger.log(`Cart add ${listingId} x${qty} for user ${userId}`);
    return cart.toObject() as Cart;
  }

  async updateQty(userId: string, listingId: string, qty: number) {
    if (qty <= 0) {
      return this.removeItem(userId, listingId);
    }
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.listingId === listingId);
    if (!item) throw new NotFoundException('Item not in cart');
    item.qty = qty;
    await cart.save();
    this.logger.log(`Cart update qty ${listingId} -> ${qty} for user ${userId}`);
    return cart.toObject() as Cart;
  }

  async removeItem(userId: string, listingId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((i) => i.listingId !== listingId);
    await cart.save();
    this.logger.log(`Cart remove ${listingId} for user ${userId}`);
    return cart.toObject() as Cart;
  }

  async clear(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    this.logger.log(`Cart cleared for user ${userId}`);
    return cart.toObject() as Cart;
  }
}

