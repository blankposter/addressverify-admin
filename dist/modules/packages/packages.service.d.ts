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
export declare class PackagesService {
    private packageModel;
    private userModel;
    constructor(packageModel: Model<EnterprisePackage>, userModel: Model<User>);
    getAllPackages(page?: number, limit?: number, status?: PackageStatus, type?: PackageType): Promise<{
        packages: EnterprisePackage[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPackageById(id: string): Promise<EnterprisePackage | null>;
    createPackage(packageData: CreatePackageDto): Promise<{
        success: boolean;
        package?: EnterprisePackage;
        error?: string;
    }>;
    updatePackage(id: string, updates: Partial<CreatePackageDto>): Promise<{
        success: boolean;
        package?: EnterprisePackage;
        error?: string;
    }>;
    deletePackage(id: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    updatePackageStatus(id: string, status: PackageStatus): Promise<{
        success: boolean;
        error?: string;
    }>;
    getPackageStats(): Promise<{
        totalPackages: number;
        activePackages: number;
        draftPackages: number;
        customPackages: number;
        totalMonthlyValue: number;
        totalYearlyValue: number;
        packagesByType: {
            [key: string]: number;
        };
    }>;
    duplicatePackage(id: string, adminId: string, adminUsername: string): Promise<{
        success: boolean;
        package?: EnterprisePackage;
        error?: string;
    }>;
}
