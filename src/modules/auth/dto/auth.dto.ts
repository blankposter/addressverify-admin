import { IsString, IsEmail, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}

export class Setup2FADto {
  @IsString()
  @MinLength(6)
  password: string;
}

export class Verify2FADto {
  @IsString()
  twoFactorCode: string;
}

export class Disable2FADto {
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateAdminDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;
}