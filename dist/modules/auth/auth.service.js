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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const speakeasy = __importStar(require("speakeasy"));
const QRCode = __importStar(require("qrcode"));
const admin_schema_1 = require("../../schemas/admin.schema");
let AuthService = class AuthService {
    adminModel;
    jwtService;
    constructor(adminModel, jwtService) {
        this.adminModel = adminModel;
        this.jwtService = jwtService;
    }
    async validateAdmin(username, password) {
        const admin = await this.adminModel.findOne({
            $or: [{ username }, { email: username }],
            isActive: true
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return admin;
    }
    async login(loginDto, ip) {
        const admin = await this.validateAdmin(loginDto.username, loginDto.password);
        if (admin.twoFactorEnabled) {
            if (!loginDto.twoFactorCode) {
                return {
                    requiresTwoFactor: true,
                    message: 'Two-factor authentication code required',
                };
            }
            const isValid = this.verify2FAToken(admin.twoFactorSecret, loginDto.twoFactorCode);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid two-factor authentication code');
            }
        }
        await this.adminModel.findByIdAndUpdate(admin._id, {
            lastLogin: new Date(),
            lastLoginIp: ip,
        });
        const payload = {
            sub: admin._id,
            username: admin.username,
            email: admin.email,
            isSuperAdmin: admin.isSuperAdmin,
        };
        return {
            access_token: this.jwtService.sign(payload),
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                fullName: admin.fullName,
                isSuperAdmin: admin.isSuperAdmin,
                twoFactorEnabled: admin.twoFactorEnabled,
            },
        };
    }
    async setup2FA(adminId) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.BadRequestException('Admin not found');
        }
        const secret = speakeasy.generateSecret({
            name: `AddressVerify Admin (${admin.email})`,
            length: 32,
        });
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        const backupCodes = Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
        admin.twoFactorSecret = secret.base32;
        admin.twoFactorBackupCodes = backupCodes.map(code => bcrypt.hashSync(code, 10));
        await admin.save();
        return {
            secret: secret.base32,
            qrCode: qrCodeUrl,
            backupCodes,
        };
    }
    async verify2FA(adminId, dto) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.BadRequestException('Admin not found');
        }
        const isValid = this.verify2FAToken(admin.twoFactorSecret, dto.token);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        admin.twoFactorEnabled = true;
        await admin.save();
        return {
            message: 'Two-factor authentication enabled successfully',
        };
    }
    async disable2FA(adminId, password) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.BadRequestException('Admin not found');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        admin.twoFactorEnabled = false;
        admin.twoFactorSecret = undefined;
        admin.twoFactorBackupCodes = undefined;
        await admin.save();
        return {
            message: 'Two-factor authentication disabled successfully',
        };
    }
    verify2FAToken(secret, token) {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 2,
        });
    }
    async findAdminById(id) {
        return this.adminModel.findById(id).select('-password');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map