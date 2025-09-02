import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AdminDocument } from '../../schemas/admin.schema';
import { LoginDto, Verify2FADto } from './dto/auth.dto';
export declare class AuthService {
    private adminModel;
    private jwtService;
    constructor(adminModel: Model<AdminDocument>, jwtService: JwtService);
    validateAdmin(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto, ip: string): Promise<{
        requiresTwoFactor: boolean;
        message: string;
        access_token?: undefined;
        admin?: undefined;
    } | {
        access_token: string;
        admin: {
            id: any;
            username: any;
            email: any;
            fullName: any;
            isSuperAdmin: any;
            twoFactorEnabled: any;
        };
        requiresTwoFactor?: undefined;
        message?: undefined;
    }>;
    setup2FA(adminId: string): Promise<{
        secret: string;
        qrCode: string;
        backupCodes: string[];
    }>;
    verify2FA(adminId: string, dto: Verify2FADto): Promise<{
        message: string;
    }>;
    disable2FA(adminId: string, password: string): Promise<{
        message: string;
    }>;
    private verify2FAToken;
    findAdminById(id: string): Promise<AdminDocument>;
}
