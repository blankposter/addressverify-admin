import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Admin, AdminDocument } from '../../schemas/admin.schema';
import { LoginDto, Setup2FADto, Verify2FADto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    console.log(`🔍 Login attempt - Username: ${username}`);
    
    const admin = await this.adminModel.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });

    if (!admin) {
      console.log(`❌ Admin not found for username: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`✅ Admin found: ${admin.username} (${admin.email})`);
    console.log(`🔒 Comparing password with hash...`);
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log(`🔐 Password valid: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      console.log(`❌ Password comparison failed for ${admin.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`✅ Login validation successful for ${admin.username}`);
    return admin;
  }

  async login(loginDto: LoginDto, ip: string) {
    const admin = await this.validateAdmin(loginDto.username, loginDto.password);

    // Check if 2FA is enabled
    if (admin.twoFactorEnabled) {
      if (!loginDto.twoFactorCode) {
        return {
          requiresTwoFactor: true,
          message: 'Two-factor authentication code required',
        };
      }

      const isValid = this.verify2FAToken(admin.twoFactorSecret, loginDto.twoFactorCode);
      if (!isValid) {
        throw new UnauthorizedException('Invalid two-factor authentication code');
      }
    }

    // Update last login
    await this.adminModel.findByIdAndUpdate(admin._id, {
      lastLogin: new Date(),
      lastLoginIp: ip,
    });

    const payload = {
      sub: admin._id,
      username: admin.username,
      email: admin.email,
      isSuperAdmin: admin.isSuperAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        isSuperAdmin: admin.isSuperAdmin,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    };
  }

  async setup2FA(adminId: string) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `AddressVerify Admin (${admin.email})`,
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Save secret temporarily (will be confirmed when user verifies)
    admin.twoFactorSecret = secret.base32;
    admin.twoFactorBackupCodes = backupCodes.map(code => 
      bcrypt.hashSync(code, 10)
    );
    await admin.save();

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes,
    };
  }

  async verify2FA(adminId: string, dto: Verify2FADto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const isValid = this.verify2FAToken(admin.twoFactorSecret!, dto.twoFactorCode);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    // Enable 2FA
    admin.twoFactorEnabled = true;
    await admin.save();

    return {
      message: 'Two-factor authentication enabled successfully',
    };
  }

  async disable2FA(adminId: string, password: string) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    admin.twoFactorEnabled = false;
    admin.twoFactorSecret = undefined;
    admin.twoFactorBackupCodes = undefined;
    await admin.save();

    return {
      message: 'Two-factor authentication disabled successfully',
    };
  }

  private verify2FAToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });
  }

  async findAdminById(id: string): Promise<AdminDocument> {
    return this.adminModel.findById(id).select('-password');
  }

  async getProfile(adminId: string) {
    const admin = await this.adminModel.findById(adminId).select('-password -twoFactorSecret -twoFactorBackupCodes');
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    
    return {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      isSuperAdmin: admin.isSuperAdmin,
      twoFactorEnabled: admin.twoFactorEnabled,
      lastLogin: admin.lastLogin,
      createdAt: (admin as any).createdAt,
    };
  }
}