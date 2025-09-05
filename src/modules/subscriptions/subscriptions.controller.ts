import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionStatus } from '../../schemas/subscription.schema';

@Controller('api/admin/subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  async getAllSubscriptions(@Query() query: any) {
    const {
      page = '1',
      limit = '10',
      search = '',
      // Filter parameters
      status,
      stripe_sub_id,
      stripe_user_id,
      sub_name,
      rate_limit_period,
      rateLimitMin,
      rateLimitMax,
      totalRequestLimitMin,
      totalRequestLimitMax,
      stripe_plan_id,
      stripe_product_id,
      stripe_meter_id,
      usageCountMin,
      usageCountMax,
      expiresInStart,
      expiresInEnd,
      startsInStart,
      startsInEnd,
      createdAtStart,
      createdAtEnd,
      // Sort parameters
      sortField,
      sortOrder = 'desc'
    } = query;

    const filters: any = {};
    if (status) filters.status = status;
    if (stripe_sub_id) filters.stripe_sub_id = stripe_sub_id;
    if (stripe_user_id) filters.stripe_user_id = stripe_user_id;
    if (sub_name) filters.sub_name = sub_name;
    if (rate_limit_period) filters.rate_limit_period = rate_limit_period;
    if (rateLimitMin !== undefined || rateLimitMax !== undefined) {
      filters.rate_limit = {};
      if (rateLimitMin !== undefined) filters.rate_limit.min = parseInt(rateLimitMin);
      if (rateLimitMax !== undefined) filters.rate_limit.max = parseInt(rateLimitMax);
    }
    if (totalRequestLimitMin !== undefined || totalRequestLimitMax !== undefined) {
      filters.total_request_limit = {};
      if (totalRequestLimitMin !== undefined) filters.total_request_limit.min = parseInt(totalRequestLimitMin);
      if (totalRequestLimitMax !== undefined) filters.total_request_limit.max = parseInt(totalRequestLimitMax);
    }
    if (stripe_plan_id) filters.stripe_plan_id = stripe_plan_id;
    if (stripe_product_id) filters.stripe_product_id = stripe_product_id;
    if (stripe_meter_id) filters.stripe_meter_id = stripe_meter_id;
    if (usageCountMin !== undefined || usageCountMax !== undefined) {
      filters.usage_count = {};
      if (usageCountMin !== undefined) filters.usage_count.min = parseInt(usageCountMin);
      if (usageCountMax !== undefined) filters.usage_count.max = parseInt(usageCountMax);
    }
    if (expiresInStart || expiresInEnd) {
      filters.expires_in = {};
      if (expiresInStart) filters.expires_in.start = expiresInStart;
      if (expiresInEnd) filters.expires_in.end = expiresInEnd;
    }
    if (startsInStart || startsInEnd) {
      filters.starts_in = {};
      if (startsInStart) filters.starts_in.start = startsInStart;
      if (startsInEnd) filters.starts_in.end = startsInEnd;
    }
    if (createdAtStart || createdAtEnd) {
      filters.createdAt = {};
      if (createdAtStart) filters.createdAt.start = createdAtStart;
      if (createdAtEnd) filters.createdAt.end = createdAtEnd;
    }

    const sort = {
      field: sortField,
      order: sortOrder as 'asc' | 'desc'
    };

    return this.subscriptionsService.getAllSubscriptions(
      parseInt(page),
      parseInt(limit),
      search,
      filters,
      sort
    );
  }

  @Get('stats')
  async getStats() {
    return this.subscriptionsService.getSubscriptionStats();
  }

  @Get('expiring')
  async getExpiringSubscriptions(
    @Query('days') days = '7'
  ) {
    return this.subscriptionsService.getExpiringSubscriptions(parseInt(days));
  }

  @Get('user/:userId')
  async getSubscriptionsByUser(@Param('userId') userId: string) {
    return this.subscriptionsService.getSubscriptionsByUser(userId);
  }

  @Get(':id')
  async getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionsService.getSubscriptionById(id);
  }

  @Put(':id/status')
  async updateSubscriptionStatus(
    @Param('id') id: string,
    @Body('status') status: SubscriptionStatus
  ) {
    const success = await this.subscriptionsService.updateSubscriptionStatus(id, status);
    return { success };
  }
}