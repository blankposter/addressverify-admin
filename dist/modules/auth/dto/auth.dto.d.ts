export declare class LoginDto {
    username: string;
    password: string;
    twoFactorCode?: string;
}
export declare class Setup2FADto {
    password: string;
}
export declare class Verify2FADto {
    token: string;
}
export declare class Disable2FADto {
    password: string;
}
export declare class CreateAdminDto {
    username: string;
    email: string;
    password: string;
    fullName: string;
    isSuperAdmin?: boolean;
}
