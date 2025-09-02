import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreditsService, CreditOperationDto } from './credits.service';
import { TransactionType } from '../../schemas/credit-transaction.schema';

@Controller('api/admin/credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private creditsService: CreditsService) {}

  @Get('stats')
  async getStats() {
    return this.creditsService.getCreditStats();
  }

  @Get('transactions')
  async getTransactions(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('userId') userId?: string,
    @Query('type') type?: TransactionType
  ) {
    return this.creditsService.getTransactions(
      parseInt(page),
      parseInt(limit),
      userId,
      type
    );
  }

  @Get('user/:userId/history')
  async getUserCreditHistory(
    @Query('userId') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.creditsService.getUserCreditHistory(
      userId,
      parseInt(page),
      parseInt(limit)
    );
  }

  @Post('add')
  async addCredits(@Body() body: any, @Request() req: any) {
    const operation: CreditOperationDto = {
      userId: body.userId,
      amount: body.amount,
      type: TransactionType.ADD,
      description: body.description || `Admin credit addition`,
      adminId: req.user.sub,
      adminUsername: req.user.username,
      notes: body.notes,
      reference: body.reference,
    };

    return this.creditsService.addCredits(operation);
  }

  @Post('deduct')
  async deductCredits(@Body() body: any, @Request() req: any) {
    const operation: CreditOperationDto = {
      userId: body.userId,
      amount: body.amount,
      type: TransactionType.DEDUCT,
      description: body.description || `Admin credit deduction`,
      adminId: req.user.sub,
      adminUsername: req.user.username,
      notes: body.notes,
      reference: body.reference,
    };

    return this.creditsService.deductCredits(operation);
  }

  @Post('refund')
  async refundCredits(@Body() body: any, @Request() req: any) {
    const operation: CreditOperationDto = {
      userId: body.userId,
      amount: body.amount,
      type: TransactionType.REFUND,
      description: body.description || `Admin credit refund`,
      adminId: req.user.sub,
      adminUsername: req.user.username,
      notes: body.notes,
      reference: body.reference,
    };

    return this.creditsService.addCredits(operation);
  }

  @Post('bonus')
  async bonusCredits(@Body() body: any, @Request() req: any) {
    const operation: CreditOperationDto = {
      userId: body.userId,
      amount: body.amount,
      type: TransactionType.BONUS,
      description: body.description || `Admin bonus credits`,
      adminId: req.user.sub,
      adminUsername: req.user.username,
      notes: body.notes,
      reference: body.reference,
    };

    return this.creditsService.addCredits(operation);
  }

  @Post('bulk-add')
  async bulkAddCredits(@Body() body: any, @Request() req: any) {
    return this.creditsService.bulkAddCredits({
      userIds: body.userIds,
      amount: body.amount,
      description: body.description || `Bulk credit addition`,
      adminId: req.user.sub,
      adminUsername: req.user.username,
      notes: body.notes,
    });
  }
}