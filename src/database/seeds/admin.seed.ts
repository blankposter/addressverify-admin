import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
        twoFactorEnabled: false,
      },
      {
        username: 'misha',
        email: 'misha@addressverify.io',
        password: 'Misha@Admin2024!',
        fullName: 'Misha Administrator',
        isSuperAdmin: true,
        twoFactorEnabled: false,
      },
      {
        username: 'amir',
        email: 'amir@addressverify.io',
        password: 'Amir@Admin2024!',
        fullName: 'Amir Administrator',
        isSuperAdmin: true,
        twoFactorEnabled: false,
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

      // Create admin (password will be hashed by schema middleware)
      const admin = new this.adminModel({
        ...adminData,
        passwordChangedAt: new Date(),
      });

      await admin.save();

      console.log(`✅ Admin created: ${adminData.username}`);
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(`   2FA: Disabled (can be enabled through the UI)`);
      console.log('---');
    }

    console.log('✅ Admin seeding completed!');
  }

  async clear() {
    await this.adminModel.deleteMany({});
    console.log('✅ All admins cleared!');
  }
}