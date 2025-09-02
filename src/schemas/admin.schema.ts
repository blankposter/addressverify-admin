import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  // 2FA fields
  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret?: string;

  @Prop()
  twoFactorBackupCodes?: string[];

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop()
  lastLoginIp?: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  // Session management
  @Prop({ type: [String], default: [] })
  activeSessions: string[];

  @Prop({ type: Date })
  passwordChangedAt?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop({ type: Date })
  passwordResetExpires?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// Pre-save middleware to hash password
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = new Date();
  next();
});

// Instance methods
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

AdminSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};