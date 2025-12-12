import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './schemas/shop.schema';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(ShopsService.name);

  async create(ownerId: string, dto: CreateShopDto) {
    const user = await this.usersService.findById(ownerId);
    if (!user) throw new ForbiddenException('User not found');
    if (user.kycStatus !== 'verified') {
      throw new ForbiddenException('KYC not verified');
    }
    await this.usersService.addSellerRole(ownerId);
    const doc = new this.shopModel({ ...dto, ownerId, status: 'active' });
    const saved = await doc.save();
    this.logger.log(`Shop created ${saved._id} by ${ownerId}`);
    return saved;
  }

  findMine(ownerId: string) {
    return this.shopModel.find({ ownerId }).lean<Shop[]>().exec();
  }

  findPublic() {
    return this.shopModel.find({ status: 'active' }).lean<Shop[]>().exec();
  }

  async update(ownerId: string, shopId: string, dto: UpdateShopDto) {
    const shop = await this.shopModel.findById(shopId).exec();
    if (!shop) throw new NotFoundException('Shop not found');
    if (shop.ownerId !== ownerId) throw new ForbiddenException('Not your shop');
    Object.assign(shop, dto);
    const saved = await shop.save();
    this.logger.log(`Shop updated ${shopId} by ${ownerId}`);
    return saved;
  }
}

