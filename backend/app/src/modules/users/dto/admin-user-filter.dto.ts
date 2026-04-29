import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

const trimOptionalString = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const parseOptionalBoolean = ({ value }: { value: unknown }): unknown => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
};

export class AdminUserFilterDto {
  @IsOptional()
  @Transform(trimOptionalString)
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(trimOptionalString)
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @Transform(trimOptionalString)
  @IsString()
  gender?: string;

  @IsOptional()
  @Transform(parseOptionalBoolean)
  @IsBoolean()
  isActive?: boolean;
}
