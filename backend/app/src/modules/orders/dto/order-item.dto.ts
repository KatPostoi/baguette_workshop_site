import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class OrderItemInputDto {
  @IsOptional()
  @IsString()
  catalogItemId?: string;

  @IsOptional()
  @IsString()
  customFrameId?: string;

  @ValidateIf((o) => !o.catalogItemId && !o.customFrameId)
  _?: never;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
