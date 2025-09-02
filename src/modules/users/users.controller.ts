import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('api/admin/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = ''
  ) {
    return this.usersService.getAllUsers(
      parseInt(page), 
      parseInt(limit), 
      search
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