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
  async getAllRequests(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('statusCode') statusCode?: string,
    @Query('endpoint') endpoint?: string,
    @Query('userId') userId?: string
  ) {
    return this.requestsService.getAllRequests(
      parseInt(page),
      parseInt(limit),
      statusCode ? parseInt(statusCode) : undefined,
      endpoint,
      userId
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