import { Document } from 'mongoose';
export type AdminDocument = Admin & Document;
export declare class Admin {
    username: string;
    email: string;
    password: string;
    fullName: string;
    isActive: boolean;
    isSuperAdmin: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    twoFactorBackupCodes?: string[];
    lastLogin?: Date;
    lastLoginIp?: string;
    permissions: string[];
    activeSessions: string[];
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}
export declare const AdminSchema: import("mongoose").Schema<Admin, import("mongoose").Model<Admin, any, any, any, Document<unknown, any, Admin, any, {}> & Admin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Admin, Document<unknown, {}, import("mongoose").FlatRecord<Admin>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Admin> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
