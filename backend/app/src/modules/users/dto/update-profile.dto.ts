import { IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+\d\s()-]{7,}$/)
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;
}
