import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EnterprisePackage', schema: require('../../schemas/enterprise-package.schema').EnterprisePackageSchema },
      { name: 'User', schema: require('../../schemas/user.schema').UserSchema },
    ]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}