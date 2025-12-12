import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { Listing } from '../listings/schemas/listing.schema';
import { EventBusService } from '../event-bus/event-bus.service';
import { EVENTS } from '../event-bus/events';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
    private readonly eventBus: EventBusService,
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  async listForBuyer(buyerId: string) {
    return this.orderModel.find({ buyerId }).lean<Order[]>().exec();
  }

  async listForSeller(sellerId: string) {
    return this.orderModel.find({ sellerId }).lean<Order[]>().exec();
  }

  async getById(id: string, buyerId: string) {
    const order = await this.orderModel.findById(id).lean<Order>().exec();
    if (!order || order.buyerId !== buyerId) throw new NotFoundException('Order not found');
    return order;
  }

  private aggregateQuantities(cart: Cart) {
    const map = new Map<string, number>();
    for (const item of cart.items) {
      map.set(item.listingId, (map.get(item.listingId) ?? 0) + item.qty);
    }
    return map;
  }

  private groupBySeller(cart: Cart, listingMap: Record<string, Listing>) {
    const groups: Record<string, { items: Cart['items'] }> = {};
    for (const item of cart.items) {
      const listing = listingMap[item.listingId];
      if (!listing) continue;
      const sellerId = listing.sellerId;
      if (!groups[sellerId]) groups[sellerId] = { items: [] };
      groups[sellerId].items.push(item);
    }
    return groups;
  }

  async checkout(buyerId: string) {
    const cart = await this.cartModel.findOne({ userId: buyerId }).lean<Cart>().exec();
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const listingIds = cart.items.map((i) => i.listingId);
    const listings = await this.listingModel
      .find({ _id: { $in: listingIds } })
      .lean<Listing[]>()
      .exec();
    const listingMap = Object.fromEntries(listings.map((l) => [(l as any)._id.toString(), l]));

    const requiredQty = this.aggregateQuantities(cart);
    // stock check + decrement
    for (const [listingId, qty] of requiredQty.entries()) {
      const listing = listingMap[listingId];
      if (!listing || listing.status !== 'published') {
        throw new NotFoundException(`Listing not available: ${listingId}`);
      }
      if ((listing.stock ?? 0) < qty) {
        throw new NotFoundException(`Insufficient stock for listing ${listingId}`);
      }
      const updated = await this.listingModel
        .findByIdAndUpdate(listingId, { $inc: { stock: -qty } }, { new: true })
        .lean<Listing>()
        .exec();
      await this.eventBus.emit(EVENTS.stockUpdated, {
        listingId,
        stock: updated?.stock ?? 0,
      });
      this.logger.log(`Stock reserved ${listingId} -${qty}`);
    }

    const groups = this.groupBySeller(cart, listingMap);
    const orders: Order[] = [];

    for (const [sellerId, group] of Object.entries(groups)) {
      const order = new this.orderModel({
        buyerId,
        sellerId,
        items: group.items.map((item) => ({
          listingId: item.listingId,
          qty: item.qty,
          price: item.priceSnapshot,
        })),
        status: 'created',
      });
      const saved = await order.save();
      orders.push(saved.toObject() as Order);
      await this.eventBus.emit(EVENTS.orderCreated, {
        orderId: (saved as any)._id.toString(),
        buyerId,
        sellerId,
      });
      this.logger.log(`Order created ${saved._id} buyer ${buyerId} seller ${sellerId}`);
    }

    // clear cart
    await this.cartModel.updateOne({ userId: buyerId }, { $set: { items: [] } }).exec();

    return orders;
  }

  async updateStatus(id: string, sellerId: string, status: Order['status']) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    if (order.sellerId !== sellerId) throw new ForbiddenException('Not your order');

    const prev = order.status;
    order.status = status;
    await order.save();

    if (status === 'cancelled' && prev !== 'cancelled') {
      for (const item of order.items) {
        const updated = await this.listingModel
          .findByIdAndUpdate(item.listingId, { $inc: { stock: item.qty } }, { new: true })
          .lean<Listing>()
          .exec();
        await this.eventBus.emit(EVENTS.stockReleased, {
          listingId: item.listingId,
          stock: updated?.stock ?? 0,
        });
        this.logger.log(`Stock released ${item.listingId} +${item.qty}`);
      }
      await this.eventBus.emit(EVENTS.orderCancelled, {
        orderId: id,
        sellerId,
        buyerId: order.buyerId,
      });
      this.logger.log(`Order cancelled ${id}`);
    }

    if (status === 'delivered') {
      await this.eventBus.emit(EVENTS.orderDelivered, {
        orderId: id,
        sellerId,
        buyerId: order.buyerId,
      });
      this.logger.log(`Order delivered ${id}`);
    }

    if (status === 'paid') {
      await this.eventBus.emit(EVENTS.orderPaid, {
        orderId: id,
        sellerId,
        buyerId: order.buyerId,
      });
      this.logger.log(`Order paid ${id}`);
    }

    return order.toObject() as Order;
  }
}

