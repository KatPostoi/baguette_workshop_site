import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimNullableString = ({ value }: { value: unknown }): unknown => {
  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export class AdminCreateUserDto {
  @Transform(trimString)
  @IsEmail()
  email!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(6)
  password!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @Matches(/^[+\d\s()-]{7,}$/)
  phone?: string | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  gender?: string | null;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
