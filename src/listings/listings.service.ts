import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { REDIS_CLIENT } from '../cache/redis.module';
import { Redis } from 'ioredis';
import { EventBusService } from '../event-bus/event-bus.service';
import { EVENTS } from '../event-bus/events';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name)
    private readonly listingModel: Model<Listing>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly eventBus: EventBusService,
  ) {}

  private readonly logger = new Logger(ListingsService.name);

  private cacheKey(id: string) {
    return `listing:${id}`;
  }

  private async cacheGet(id: string) {
    const data = await this.redis.get(this.cacheKey(id));
    return data ? (JSON.parse(data) as Listing) : null;
  }

  private async cacheSet(listing: Listing) {
    await this.redis.set(this.cacheKey((listing as any)._id ?? ''), JSON.stringify(listing), 'EX', 60);
  }

  private async cacheDel(id: string) {
    await this.redis.del(this.cacheKey(id));
  }

  async create(dto: CreateListingDto, sellerId: string) {
    const doc = new this.listingModel({
      ...dto,
      sellerId,
      status: 'draft',
    });
    const saved = await doc.save();
    await this.cacheSet(saved.toObject() as Listing);
    await this.eventBus.emit(EVENTS.listingCreated, {
      listingId: (saved as any)._id.toString(),
      sellerId,
      status: saved.status,
    });
    this.logger.log(`Listing created ${saved._id} by ${sellerId}`);
    return saved;
  }

  async findById(id: string) {
    const cached = await this.cacheGet(id);
    if (cached) return cached;

    const listing = await this.listingModel.findById(id).lean<Listing>().exec();
    if (!listing) throw new NotFoundException('Listing not found');
    await this.cacheSet(listing);
    return listing;
  }

  private ensureOwner(listing: Listing, sellerId: string) {
    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('Not owner of listing');
    }
  }

  async update(id: string, sellerId: string, dto: UpdateListingDto) {
    const listing = await this.listingModel.findById(id).exec();
    if (!listing) throw new NotFoundException('Listing not found');
    this.ensureOwner(listing.toObject() as Listing, sellerId);
    Object.assign(listing, dto);
    const saved = await listing.save();
    await this.cacheSet(saved.toObject() as Listing);
    await this.eventBus.emit(EVENTS.listingUpdated, {
      listingId: id,
      sellerId,
      status: saved.status,
    });
    this.logger.log(`Listing updated ${id} by ${sellerId}`);
    return saved;
  }

  async publish(id: string, sellerId: string) {
    const listing = await this.listingModel.findById(id).exec();
    if (!listing) throw new NotFoundException('Listing not found');
    this.ensureOwner(listing.toObject() as Listing, sellerId);
    listing.status = 'published';
    const saved = await listing.save();
    await this.cacheSet(saved.toObject() as Listing);
    await this.eventBus.emit(EVENTS.listingPublished, {
      listingId: id,
      sellerId,
      status: saved.status,
    });
    this.logger.log(`Listing published ${id} by ${sellerId}`);
    return saved;
  }

  async deactivate(id: string, sellerId: string) {
    const listing = await this.listingModel.findById(id).exec();
    if (!listing) throw new NotFoundException('Listing not found');
    this.ensureOwner(listing.toObject() as Listing, sellerId);
    listing.status = 'disabled';
    const saved = await listing.save();
    await this.cacheSet(saved.toObject() as Listing);
    await this.eventBus.emit(EVENTS.listingUpdated, {
      listingId: id,
      sellerId,
      status: saved.status,
    });
    this.logger.log(`Listing deactivated ${id} by ${sellerId}`);
    return saved;
  }
}

