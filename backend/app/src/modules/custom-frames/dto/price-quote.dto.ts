import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class PriceQuoteDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  materialId!: number;

  @IsOptional()
  @IsNotEmpty()
  styleId?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  widthCm!: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  heightCm!: number;
}
