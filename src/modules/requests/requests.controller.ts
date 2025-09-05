import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestsService } from './requests.service';

@Controller('api/admin/requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Get('stats')
  async getStats() {
    return this.requestsService.getRequestStats();
  }

  @Get('failed')
  async getFailedRequests(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('statusCode') statusCode?: string,
    @Query('endpoint') endpoint?: string,
    @Query('userId') userId?: string
  ) {
    return this.requestsService.getFailedRequests(
      parseInt(page),
      parseInt(limit),
      statusCode ? parseInt(statusCode) : undefined,
      endpoint,
      userId
    );
  }

  @Get('all')
  async getAllRequests(@Query() query: any) {
    const {
      page = '1',
      limit = '10',
      search = '',
      // Filter parameters
      endpoint,
      user_id,
      stripe_user_id,
      ip,
      user_agent,
      status_code,
      statusCodeMin,
      statusCodeMax,
      subscription_id,
      costMin,
      costMax,
      responseTimeMin,
      responseTimeMax,
      dateStart,
      dateEnd,
      createdAtStart,
      createdAtEnd,
      // Sort parameters
      sortField,
      sortOrder = 'desc'
    } = query;

    const filters: any = {};
    if (endpoint) filters.endpoint = endpoint;
    if (user_id) filters.user_id = user_id;
    if (stripe_user_id) filters.stripe_user_id = stripe_user_id;
    if (ip) filters.ip = ip;
    if (user_agent) filters.user_agent = user_agent;
    if (status_code) filters.status_code = parseInt(status_code);
    if (statusCodeMin !== undefined || statusCodeMax !== undefined) {
      filters.status_code_range = {};
      if (statusCodeMin !== undefined) filters.status_code_range.min = parseInt(statusCodeMin);
      if (statusCodeMax !== undefined) filters.status_code_range.max = parseInt(statusCodeMax);
    }
    if (subscription_id) filters.subscription_id = subscription_id;
    if (costMin !== undefined || costMax !== undefined) {
      filters.cost = {};
      if (costMin !== undefined) filters.cost.min = parseFloat(costMin);
      if (costMax !== undefined) filters.cost.max = parseFloat(costMax);
    }
    if (responseTimeMin !== undefined || responseTimeMax !== undefined) {
      filters.response_time = {};
      if (responseTimeMin !== undefined) filters.response_time.min = parseInt(responseTimeMin);
      if (responseTimeMax !== undefined) filters.response_time.max = parseInt(responseTimeMax);
    }
    if (dateStart || dateEnd) {
      filters.date = {};
      if (dateStart) filters.date.start = dateStart;
      if (dateEnd) filters.date.end = dateEnd;
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

    return this.requestsService.getAllRequests(
      parseInt(page),
      parseInt(limit),
      search,
      filters,
      sort
    );
  }

  @Get('by-endpoint')
  async getRequestsByEndpoint() {
    return this.requestsService.getRequestsByEndpoint();
  }

  @Get('errors-timeline')
  async getErrorsTimeline(
    @Query('hours') hours = '24'
  ) {
    return this.requestsService.getErrorsByTimeRange(parseInt(hours));
  }
}