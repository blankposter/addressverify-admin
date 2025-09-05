import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnterprisePackage, PackageStatus, PackageType } from '../../schemas/enterprise-package.schema';
import { User } from '../../schemas/user.schema';

export interface CreatePackageDto {
  name: string;
  description: string;
  type: PackageType;
  monthlyPrice: number;
  yearlyPrice: number;
  features: any;
  includedServices: string[];
  setupFee?: number;
  isCustom?: boolean;
  customerId?: string;
  customerEmail?: string;
  notes?: string;
  validFrom?: Date;
  validUntil?: Date;
  adminId: string;
  adminUsername: string;
}

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel('EnterprisePackage') private packageModel: Model<EnterprisePackage>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getAllPackages(page = 1, limit = 10, status?: PackageStatus, type?: PackageType): Promise<{
    packages: EnterprisePackage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const [packages, total] = await Promise.all([
      this.packageModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.packageModel.countDocuments(query),
    ]);

    return {
      packages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPackageById(id: string): Promise<EnterprisePackage | null> {
    return this.packageModel.findById(id).lean();
  }

  async createPackage(packageData: CreatePackageDto): Promise<{
    success: boolean;
    package?: EnterprisePackage;
    error?: string;
  }> {
    try {
      // If it's a custom package, verify the customer exists
      if (packageData.isCustom && packageData.customerId) {
        const customer = await this.userModel.findById(packageData.customerId);
        if (!customer) {
          return { success: false, error: 'Customer not found' };
        }
        packageData.customerEmail = customer.email;
      }

      const newPackage = new this.packageModel({
        ...packageData,
        createdBy: packageData.adminId,
        createdByUsername: packageData.adminUsername,
        status: PackageStatus.DRAFT,
      });

      const savedPackage = await newPackage.save();
      return { success: true, package: savedPackage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updatePackage(
    id: string, 
    updates: Partial<CreatePackageDto>
  ): Promise<{
    success: boolean;
    package?: EnterprisePackage;
    error?: string;
  }> {
    try {
      // If updating customer, verify they exist
      if (updates.customerId) {
        const customer = await this.userModel.findById(updates.customerId);
        if (!customer) {
          return { success: false, error: 'Customer not found' };
        }
        updates.customerEmail = customer.email;
      }

      const updatedPackage = await this.packageModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, lean: true }
      );

      if (!updatedPackage) {
        return { success: false, error: 'Package not found' };
      }

      return { success: true, package: updatedPackage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deletePackage(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const result = await this.packageModel.findByIdAndDelete(id);
      
      if (!result) {
        return { success: false, error: 'Package not found' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updatePackageStatus(id: string, status: PackageStatus): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const result = await this.packageModel.updateOne(
        { _id: id },
        { status }
      );

      if (result.matchedCount === 0) {
        return { success: false, error: 'Package not found' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPackageStats(): Promise<{
    totalPackages: number;
    activePackages: number;
    draftPackages: number;
    customPackages: number;
    totalMonthlyValue: number;
    totalYearlyValue: number;
    packagesByType: { [key: string]: number };
  }> {
    const packages = await this.packageModel.find().lean();

    const totalPackages = packages.length;
    const activePackages = packages.filter(p => p.status === PackageStatus.ACTIVE).length;
    const draftPackages = packages.filter(p => p.status === PackageStatus.DRAFT).length;
    const customPackages = packages.filter(p => p.isCustom).length;

    const activePackagesList = packages.filter(p => p.status === PackageStatus.ACTIVE);
    const totalMonthlyValue = activePackagesList.reduce((sum, p) => sum + p.monthlyPrice, 0);
    const totalYearlyValue = activePackagesList.reduce((sum, p) => sum + p.yearlyPrice, 0);

    const packagesByType = packages.reduce((acc, pkg) => {
      acc[pkg.type] = (acc[pkg.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPackages,
      activePackages,
      draftPackages,
      customPackages,
      totalMonthlyValue,
      totalYearlyValue,
      packagesByType,
    };
  }

  async duplicatePackage(
    id: string, 
    adminId: string, 
    adminUsername: string
  ): Promise<{
    success: boolean;
    package?: EnterprisePackage;
    error?: string;
  }> {
    try {
      const originalPackage = await this.packageModel.findById(id).lean();
      if (!originalPackage) {
        return { success: false, error: 'Package not found' };
      }

      const { _id, createdAt, updatedAt, __v, ...packageData } = originalPackage as any;
      
      const duplicatedPackage = new this.packageModel({
        ...packageData,
        name: `${originalPackage.name} (Copy)`,
        status: PackageStatus.DRAFT,
        createdBy: adminId,
        createdByUsername: adminUsername,
        isCustom: false, // Duplicates should not be custom by default
        customerId: undefined,
        customerEmail: undefined,
      });

      const savedPackage = await duplicatedPackage.save();
      return { success: true, package: savedPackage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}