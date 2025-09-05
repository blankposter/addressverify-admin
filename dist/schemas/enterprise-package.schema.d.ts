import { Document } from 'mongoose';
export declare enum PackageStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DRAFT = "draft"
}
export declare enum PackageType {
    STANDARD = "standard",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise",
    CUSTOM = "custom"
}
export interface PackageFeatures {
    apiCalls: number;
    rateLimit: number;
    rateLimitPeriod: string;
    bulkProcessing: boolean;
    prioritySupport: boolean;
    dedicatedAccount: boolean;
    slaGuarantee?: string;
    customIntegration: boolean;
    whitelabeling: boolean;
    analytics: boolean;
}
export declare class EnterprisePackage extends Document {
    name: string;
    description: string;
    type: PackageType;
    status: PackageStatus;
    monthlyPrice: number;
    yearlyPrice: number;
    features: PackageFeatures;
    includedServices: string[];
    setupFee: number;
    isCustom: boolean;
    customerId?: string;
    customerEmail?: string;
    createdBy: string;
    createdByUsername: string;
    notes?: string;
    validFrom: Date;
    validUntil?: Date;
}
export declare const EnterprisePackageSchema: import("mongoose").Schema<EnterprisePackage, import("mongoose").Model<EnterprisePackage, any, any, any, Document<unknown, any, EnterprisePackage, any, {}> & EnterprisePackage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EnterprisePackage, Document<unknown, {}, import("mongoose").FlatRecord<EnterprisePackage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<EnterprisePackage> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
