import { AuthService } from './auth.service';
import { LoginDto, Verify2FADto, Disable2FADto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<import("../../schemas/admin.schema").AdminDocument>;
    setup2FA(req: any): Promise<{
        secret: string;
        qrCode: string;
        backupCodes: string[];
    }>;
    verify2FA(req: any, dto: Verify2FADto): Promise<{
        message: string;
    }>;
    disable2FA(req: any, dto: Disable2FADto): Promise<{
        message: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
