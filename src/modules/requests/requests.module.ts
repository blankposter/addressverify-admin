import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Request', schema: require('../../schemas/request.schema').RequestSchema },
      { name: 'User', schema: require('../../schemas/user.schema').UserSchema },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}