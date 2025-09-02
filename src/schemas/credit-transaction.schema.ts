import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
  ADD = 'add',
  DEDUCT = 'deduct',
  REFUND = 'refund',
  BONUS = 'bonus',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

@Schema({ timestamps: true })
export class CreditTransaction extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ enum: Object.values(TransactionType), required: true })
  type: TransactionType;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, min: 0 })
  balanceBefore: number;

  @Prop({ required: true, min: 0 })
  balanceAfter: number;

  @Prop({ enum: Object.values(TransactionStatus), default: TransactionStatus.COMPLETED })
  status: TransactionStatus;

  @Prop({ required: true })
  description: string;

  @Prop()
  reference?: string;

  @Prop({ required: true })
  adminId: string;

  @Prop({ required: true })
  adminUsername: string;

  @Prop()
  notes?: string;
}

export const CreditTransactionSchema = SchemaFactory.createForClass(CreditTransaction);