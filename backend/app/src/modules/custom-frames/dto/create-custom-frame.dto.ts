import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomFrameDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  materialId!: number;

  @IsOptional()
  @IsNotEmpty()
  styleId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  color?: string;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  widthCm!: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  heightCm!: number;

  @IsOptional()
  @IsString()
  previewUrl?: string | null;
}
