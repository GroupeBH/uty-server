import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

class PickupAddress {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type!: 'Point';

  @Prop({ type: [Number], required: true, index: '2dsphere' })
  coordinates!: [number, number]; // [lng, lat]

  @Prop()
  label?: string;

  @Prop()
  street?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, unique: true, sparse: true })
  email?: string;

  @Prop({ required: false, unique: true, sparse: true })
  username?: string;

  @Prop({ required: true, unique: true })
  phone!: string;

  @Prop({ required: false })
  passwordHash?: string;

  @Prop({ type: [String], default: ['buyer'] })
  roles!: string[];

  @Prop({ default: 'pending' })
  kycStatus!: 'pending' | 'verified' | 'rejected';

  @Prop({ required: false })
  kycDocumentUrl?: string;

  @Prop({ required: false })
  kycVerifiedAt?: Date;

  @Prop({ type: Object, default: {} })
  profile?: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  devices?: string[]; // FCM tokens

  @Prop({ type: String, default: 'local' })
  provider!: 'local' | 'google' | 'facebook' | 'apple';

  @Prop({ type: String, required: false })
  providerId?: string;

  @Prop({ required: false })
  avatarUrl?: string; // photo de profil

  @Prop({ type: PickupAddress, _id: false })
  pickupAddress?: PickupAddress;
}

export const UserSchema = SchemaFactory.createForClass(User);

