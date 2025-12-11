import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ type: [String], default: ['buyer'] })
  roles!: string[];

  @Prop({ default: 'pending' })
  kycStatus!: 'pending' | 'verified' | 'rejected';

  @Prop({ type: Object, default: {} })
  profile?: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  devices?: string[]; // FCM tokens
}

export const UserSchema = SchemaFactory.createForClass(User);

