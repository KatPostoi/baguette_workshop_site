import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class RemoveBasketItemDto {
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
}
