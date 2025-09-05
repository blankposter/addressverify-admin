"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enterprise_package_schema_1 = require("../../schemas/enterprise-package.schema");
let PackagesService = class PackagesService {
    packageModel;
    userModel;
    constructor(packageModel, userModel) {
        this.packageModel = packageModel;
        this.userModel = userModel;
    }
    async getAllPackages(page = 1, limit = 10, status, type) {
        const skip = (page - 1) * limit;
        const query = {};
        if (status)
            query.status = status;
        if (type)
            query.type = type;
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
    async getPackageById(id) {
        return this.packageModel.findById(id).lean();
    }
    async createPackage(packageData) {
        try {
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
                status: enterprise_package_schema_1.PackageStatus.DRAFT,
            });
            const savedPackage = await newPackage.save();
            return { success: true, package: savedPackage };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updatePackage(id, updates) {
        try {
            if (updates.customerId) {
                const customer = await this.userModel.findById(updates.customerId);
                if (!customer) {
                    return { success: false, error: 'Customer not found' };
                }
                updates.customerEmail = customer.email;
            }
            const updatedPackage = await this.packageModel.findByIdAndUpdate(id, { $set: updates }, { new: true, lean: true });
            if (!updatedPackage) {
                return { success: false, error: 'Package not found' };
            }
            return { success: true, package: updatedPackage };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async deletePackage(id) {
        try {
            const result = await this.packageModel.findByIdAndDelete(id);
            if (!result) {
                return { success: false, error: 'Package not found' };
            }
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updatePackageStatus(id, status) {
        try {
            const result = await this.packageModel.updateOne({ _id: id }, { status });
            if (result.matchedCount === 0) {
                return { success: false, error: 'Package not found' };
            }
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getPackageStats() {
        const packages = await this.packageModel.find().lean();
        const totalPackages = packages.length;
        const activePackages = packages.filter(p => p.status === enterprise_package_schema_1.PackageStatus.ACTIVE).length;
        const draftPackages = packages.filter(p => p.status === enterprise_package_schema_1.PackageStatus.DRAFT).length;
        const customPackages = packages.filter(p => p.isCustom).length;
        const activePackagesList = packages.filter(p => p.status === enterprise_package_schema_1.PackageStatus.ACTIVE);
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
    async duplicatePackage(id, adminId, adminUsername) {
        try {
            const originalPackage = await this.packageModel.findById(id).lean();
            if (!originalPackage) {
                return { success: false, error: 'Package not found' };
            }
            const { _id, createdAt, updatedAt, __v, ...packageData } = originalPackage;
            const duplicatedPackage = new this.packageModel({
                ...packageData,
                name: `${originalPackage.name} (Copy)`,
                status: enterprise_package_schema_1.PackageStatus.DRAFT,
                createdBy: adminId,
                createdByUsername: adminUsername,
                isCustom: false,
                customerId: undefined,
                customerEmail: undefined,
            });
            const savedPackage = await duplicatedPackage.save();
            return { success: true, package: savedPackage };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('EnterprisePackage')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PackagesService);
//# sourceMappingURL=packages.service.js.map