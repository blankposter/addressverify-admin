import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Request extends Document {
  @Prop({ required: true })
  endpoint: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  stripe_user_id: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  user_agent: string;

  @Prop({ required: true })
  response_time: number;

  @Prop({ required: true })
  status_code: number;

  @Prop({ required: true })
  subscription_id: string;

  @Prop({ required: false })
  cost: number;

  @Prop({ required: false })
  response_data?: string;

  @Prop({ required: false })
  input_data?: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);