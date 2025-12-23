import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { CatalogItemType } from '@prisma/client';

export class AdminUpsertCatalogDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  imageUrl!: string;

  @IsString()
  imageAlt!: string;

  @IsInt()
  materialId!: number;

  @IsOptional()
  @IsString()
  styleId?: string | null;

  @IsString()
  color!: string;

  @IsEnum(CatalogItemType)
  type!: CatalogItemType;

  @IsInt()
  widthCm!: number;

  @IsInt()
  heightCm!: number;

  @IsInt()
  price!: number;

  @IsInt()
  stock!: number;
}
