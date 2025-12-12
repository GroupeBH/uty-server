import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  private readonly logger = new Logger(UsersService.name);

  findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean<User>().exec();
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).lean<User>().exec();
  }

  findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userModel.findOne({ provider, providerId }).lean<User>().exec();
  }

  async createUser(data: Partial<User>): Promise<User> {
    const doc = new this.userModel(data);
    const saved = await doc.save();
    this.logger.log(`User created ${saved._id}`);
    return saved.toObject() as unknown as User;
  }

  async submitKyc(userId: string, documentUrl: string) {
    await this.userModel
      .findByIdAndUpdate(userId, { kycStatus: 'pending', kycDocumentUrl: documentUrl })
      .exec();
    this.logger.log(`KYC submitted by ${userId}`);
    return this.findById(userId);
  }

  async verifyKyc(userId: string) {
    await this.userModel
      .findByIdAndUpdate(userId, { kycStatus: 'verified', kycVerifiedAt: new Date() })
      .exec();
    this.logger.log(`KYC verified ${userId}`);
    return this.findById(userId);
  }

  async addSellerRole(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) return null;
    const roles = new Set(user.roles ?? []);
    roles.add('seller');
    user.roles = Array.from(roles);
    await user.save();
    this.logger.log(`Seller role added to ${userId}`);
    return user.toObject() as unknown as User;
  }

  async updatePickupAddress(
    userId: string,
    pickupAddress: {
      label?: string;
      street?: string;
      city?: string;
      country?: string;
      latitude: number;
      longitude: number;
    },
  ) {
    const { latitude, longitude, label, street, city, country } = pickupAddress;
    if (latitude === undefined || longitude === undefined) {
      throw new Error('latitude and longitude are required');
    }
    const geo = {
      type: 'Point' as const,
      coordinates: [longitude, latitude] as [number, number],
      label,
      street,
      city,
      country,
    };
    await this.userModel.findByIdAndUpdate(userId, { pickupAddress: geo }).exec();
    this.logger.log(`Pickup address updated for ${userId}`);
    return this.findById(userId);
  }
}

