import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: '' })
  stripe_id: string;

  @Prop({ type: [String], default: [] })
  active_subs: string[];

  @Prop({ default: null })
  default_payment_method?: string;

  @Prop({ type: [String], default: [] })
  payment_methods?: string[];

  @Prop({ default: '' })
  apiKey: string;

  @Prop({ default: Date.now })
  last_login: Date;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ enum: ['credential', 'google'], default: 'credential' })
  provider: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  hasSeenWelcome: boolean;

  @Prop({ default: 0 })
  limitation: number;

  @Prop({ default: 0 })
  budgetAlert: number;
}

export const UserSchema = SchemaFactory.createForClass(User);