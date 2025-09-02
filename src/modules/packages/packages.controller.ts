import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PackagesService, CreatePackageDto } from './packages.service';
import { PackageStatus, PackageType } from '../../schemas/enterprise-package.schema';

@Controller('api/admin/packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private packagesService: PackagesService) {}

  @Get('stats')
  async getStats() {
    return this.packagesService.getPackageStats();
  }

  @Get()
  async getAllPackages(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: PackageStatus,
    @Query('type') type?: PackageType
  ) {
    return this.packagesService.getAllPackages(
      parseInt(page),
      parseInt(limit),
      status,
      type
    );
  }

  @Get(':id')
  async getPackageById(@Param('id') id: string) {
    return this.packagesService.getPackageById(id);
  }

  @Post()
  async createPackage(@Body() body: CreatePackageDto, @Request() req: any) {
    const packageData = {
      ...body,
      adminId: req.user.sub,
      adminUsername: req.user.username,
    };

    return this.packagesService.createPackage(packageData);
  }

  @Put(':id')
  async updatePackage(
    @Param('id') id: string,
    @Body() body: Partial<CreatePackageDto>
  ) {
    return this.packagesService.updatePackage(id, body);
  }

  @Put(':id/status')
  async updatePackageStatus(
    @Param('id') id: string,
    @Body('status') status: PackageStatus
  ) {
    return this.packagesService.updatePackageStatus(id, status);
  }

  @Post(':id/duplicate')
  async duplicatePackage(
    @Param('id') id: string,
    @Request() req: any
  ) {
    return this.packagesService.duplicatePackage(
      id,
      req.user.sub,
      req.user.username
    );
  }

  @Delete(':id')
  async deletePackage(@Param('id') id: string) {
    return this.packagesService.deletePackage(id);
  }
}