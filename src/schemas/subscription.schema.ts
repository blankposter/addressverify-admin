import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  PAUSED = 'paused',
  ENDED = 'ended',
  INCOMPLETE = 'incomplete',
}

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({ required: true })
  stripe_sub_id: string;

  @Prop({ required: true })
  stripe_user_id: string;

  @Prop({ required: true })
  sub_name: string;

  @Prop({ default: '1m' })
  rate_limit_period: string;

  @Prop({ default: 10 })
  rate_limit: number;

  @Prop({ default: null })
  total_request_limit: number;

  @Prop({ required: true })
  stripe_plan_id: string;

  @Prop({ required: true })
  stripe_product_id: string;

  @Prop({ default: null })
  stripe_meter_id: string;

  @Prop({ required: true })
  expires_in: Date;

  @Prop({ required: true })
  starts_in: Date;

  @Prop({ enum: Object.values(SubscriptionStatus), required: true })
  status: SubscriptionStatus;

  @Prop({ default: 0 })
  usage_count: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);