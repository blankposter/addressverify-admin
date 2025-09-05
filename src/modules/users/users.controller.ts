import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('api/admin/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() query: any) {
    const {
      page = '1',
      limit = '10',
      search = '',
      // Filter parameters
      email,
      status,
      role,
      provider,
      emailVerified,
      hasSeenWelcome,
      stripe_id,
      limitationMin,
      limitationMax,
      budgetAlertMin,
      budgetAlertMax,
      createdAtStart,
      createdAtEnd,
      lastLoginStart,
      lastLoginEnd,
      // Sort parameters
      sortField,
      sortOrder = 'desc'
    } = query;

    const filters: any = {};
    if (email) filters.email = email;
    if (status) filters.status = status;
    if (role) filters.role = role;
    if (provider) filters.provider = provider;
    if (emailVerified !== undefined) filters.emailVerified = emailVerified === 'true';
    if (hasSeenWelcome !== undefined) filters.hasSeenWelcome = hasSeenWelcome === 'true';
    if (stripe_id) filters.stripe_id = stripe_id;
    if (limitationMin !== undefined || limitationMax !== undefined) {
      filters.limitation = {};
      if (limitationMin !== undefined) filters.limitation.min = parseInt(limitationMin);
      if (limitationMax !== undefined) filters.limitation.max = parseInt(limitationMax);
    }
    if (budgetAlertMin !== undefined || budgetAlertMax !== undefined) {
      filters.budgetAlert = {};
      if (budgetAlertMin !== undefined) filters.budgetAlert.min = parseInt(budgetAlertMin);
      if (budgetAlertMax !== undefined) filters.budgetAlert.max = parseInt(budgetAlertMax);
    }
    if (createdAtStart || createdAtEnd) {
      filters.createdAt = {};
      if (createdAtStart) filters.createdAt.start = createdAtStart;
      if (createdAtEnd) filters.createdAt.end = createdAtEnd;
    }
    if (lastLoginStart || lastLoginEnd) {
      filters.last_login = {};
      if (lastLoginStart) filters.last_login.start = lastLoginStart;
      if (lastLoginEnd) filters.last_login.end = lastLoginEnd;
    }

    const sort = {
      field: sortField,
      order: sortOrder as 'asc' | 'desc'
    };

    return this.usersService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      search,
      filters,
      sort
    );
  }

  @Get('stats')
  async getStats() {
    return this.usersService.getSubscriptionStats();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    const success = await this.usersService.updateUserStatus(id, status);
    return { success };
  }

  @Put(':id/limitation')
  async updateUserLimitation(
    @Param('id') id: string,
    @Body('limitation') limitation: number
  ) {
    const success = await this.usersService.updateUserLimitation(id, limitation);
    return { success };
  }
}