import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

export enum PackageType {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

export interface PackageFeatures {
  apiCalls: number;
  rateLimit: number;
  rateLimitPeriod: string;
  bulkProcessing: boolean;
  prioritySupport: boolean;
  dedicatedAccount: boolean;
  slaGuarantee?: string;
  customIntegration: boolean;
  whitelabeling: boolean;
  analytics: boolean;
}

@Schema({ timestamps: true })
export class EnterprisePackage extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: Object.values(PackageType), default: PackageType.STANDARD })
  type: PackageType;

  @Prop({ enum: Object.values(PackageStatus), default: PackageStatus.DRAFT })
  status: PackageStatus;

  @Prop({ required: true })
  monthlyPrice: number;

  @Prop({ required: true })
  yearlyPrice: number;

  @Prop({ required: true, type: Object })
  features: PackageFeatures;

  @Prop({ type: [String], default: [] })
  includedServices: string[];

  @Prop({ default: 0 })
  setupFee: number;

  @Prop({ default: false })
  isCustom: boolean;

  @Prop()
  customerId?: string;

  @Prop()
  customerEmail?: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  createdByUsername: string;

  @Prop()
  notes?: string;

  @Prop({ default: Date.now })
  validFrom: Date;

  @Prop()
  validUntil?: Date;
}

export const EnterprisePackageSchema = SchemaFactory.createForClass(EnterprisePackage);