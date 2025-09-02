import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: require('../../schemas/user.schema').UserSchema },
      { name: 'Subscription', schema: require('../../schemas/subscription.schema').SubscriptionSchema },
      { name: 'CreditTransaction', schema: require('../../schemas/credit-transaction.schema').CreditTransactionSchema },
    ]),
  ],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}