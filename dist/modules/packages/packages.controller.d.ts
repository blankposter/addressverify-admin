import { PackagesService } from './packages.service';
import type { CreatePackageDto } from './packages.service';
import { PackageStatus, PackageType } from '../../schemas/enterprise-package.schema';
export declare class PackagesController {
    private packagesService;
    constructor(packagesService: PackagesService);
    getStats(): Promise<{
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
    getAllPackages(page?: string, limit?: string, status?: PackageStatus, type?: PackageType): Promise<{
        packages: import("../../schemas/enterprise-package.schema").EnterprisePackage[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPackageById(id: string): Promise<import("../../schemas/enterprise-package.schema").EnterprisePackage | null>;
    createPackage(body: CreatePackageDto, req: any): Promise<{
        success: boolean;
        package?: import("../../schemas/enterprise-package.schema").EnterprisePackage;
        error?: string;
    }>;
    updatePackage(id: string, body: Partial<CreatePackageDto>): Promise<{
        success: boolean;
        package?: import("../../schemas/enterprise-package.schema").EnterprisePackage;
        error?: string;
    }>;
    updatePackageStatus(id: string, status: PackageStatus): Promise<{
        success: boolean;
        error?: string;
    }>;
    duplicatePackage(id: string, req: any): Promise<{
        success: boolean;
        package?: import("../../schemas/enterprise-package.schema").EnterprisePackage;
        error?: string;
    }>;
    deletePackage(id: string): Promise<{
        success: boolean;
        error?: string;
    }>;
}
