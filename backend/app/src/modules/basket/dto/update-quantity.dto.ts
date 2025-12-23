import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateQuantityDto {
  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  catalogItemId?: string;

  @IsOptional()
  @IsString()
  customFrameId?: string;

  @ValidateIf((o) => !o.itemId && !o.catalogItemId && !o.customFrameId)
  _?: never;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(99)
  quantity!: number;
}
