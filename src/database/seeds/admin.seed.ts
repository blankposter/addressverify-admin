import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { Admin, AdminDocument } from '../../schemas/admin.schema';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async seed() {
    const admins = [
      {
        username: 'david',
        email: 'david@addressverify.io',
        password: 'David@Admin2024!',
        fullName: 'David Administrator',
        isSuperAdmin: true,
        twoFactorEnabled: true,
      },
      {
        username: 'misha',
        email: 'misha@addressverify.io',
        password: 'Misha@Admin2024!',
        fullName: 'Misha Administrator',
        isSuperAdmin: true,
        twoFactorEnabled: true,
      },
      {
        username: 'amir',
        email: 'amir@addressverify.io',
        password: 'Amir@Admin2024!',
        fullName: 'Amir Administrator',
        isSuperAdmin: true,
        twoFactorEnabled: true,
      },
    ];

    for (const adminData of admins) {
      // Check if admin already exists
      const existingAdmin = await this.adminModel.findOne({
        $or: [
          { username: adminData.username },
          { email: adminData.email },
        ],
      });

      if (existingAdmin) {
        console.log(`Admin ${adminData.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Generate 2FA secret
      const secret = speakeasy.generateSecret({
        name: `AddressVerify Admin (${adminData.email})`,
        length: 32,
      });

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () =>
        Math.random().toString(36).substring(2, 10).toUpperCase(),
      );

      // Create admin
      const admin = new this.adminModel({
        ...adminData,
        password: hashedPassword,
        twoFactorSecret: secret.base32,
        twoFactorBackupCodes: backupCodes.map(code => bcrypt.hashSync(code, 10)),
        passwordChangedAt: new Date(),
      });

      await admin.save();

      console.log(`✅ Admin created: ${adminData.username}`);
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(`   2FA Secret: ${secret.base32}`);
      console.log(`   2FA QR Code: ${secret.otpauth_url}`);
      console.log(`   Backup Codes: ${backupCodes.join(', ')}`);
      console.log('---');
    }

    console.log('✅ Admin seeding completed!');
  }

  async clear() {
    await this.adminModel.deleteMany({});
    console.log('✅ All admins cleared!');
  }
}