"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeeder = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const speakeasy = __importStar(require("speakeasy"));
const admin_schema_1 = require("../../schemas/admin.schema");
let AdminSeeder = class AdminSeeder {
    adminModel;
    constructor(adminModel) {
        this.adminModel = adminModel;
    }
    async seed() {
        const admins = [
            {
                username: 'david',
                email: 'david@addressverify.io',
                password: 'David@Admin2024!',
                fullName: 'David Administrator',
                isSuperAdmin: true,
                twoFactorEnabled: true,
            },
            {
                username: 'misha',
                email: 'misha@addressverify.io',
                password: 'Misha@Admin2024!',
                fullName: 'Misha Administrator',
                isSuperAdmin: true,
                twoFactorEnabled: true,
            },
            {
                username: 'amir',
                email: 'amir@addressverify.io',
                password: 'Amir@Admin2024!',
                fullName: 'Amir Administrator',
                isSuperAdmin: true,
                twoFactorEnabled: true,
            },
        ];
        for (const adminData of admins) {
            const existingAdmin = await this.adminModel.findOne({
                $or: [
                    { username: adminData.username },
                    { email: adminData.email },
                ],
            });
            if (existingAdmin) {
                console.log(`Admin ${adminData.username} already exists, skipping...`);
                continue;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);
            const secret = speakeasy.generateSecret({
                name: `AddressVerify Admin (${adminData.email})`,
                length: 32,
            });
            const backupCodes = Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
            const admin = new this.adminModel({
                ...adminData,
                password: hashedPassword,
                twoFactorSecret: secret.base32,
                twoFactorBackupCodes: backupCodes.map(code => bcrypt.hashSync(code, 10)),
                passwordChangedAt: new Date(),
            });
            await admin.save();
            console.log(`✅ Admin created: ${adminData.username}`);
            console.log(`   Email: ${adminData.email}`);
            console.log(`   Password: ${adminData.password}`);
            console.log(`   2FA Secret: ${secret.base32}`);
            console.log(`   2FA QR Code: ${secret.otpauth_url}`);
            console.log(`   Backup Codes: ${backupCodes.join(', ')}`);
            console.log('---');
        }
        console.log('✅ Admin seeding completed!');
    }
    async clear() {
        await this.adminModel.deleteMany({});
        console.log('✅ All admins cleared!');
    }
};
exports.AdminSeeder = AdminSeeder;
exports.AdminSeeder = AdminSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminSeeder);
//# sourceMappingURL=admin.seed.js.map