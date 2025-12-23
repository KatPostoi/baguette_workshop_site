import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpsertBasketItemDto {
  @IsOptional()
  @IsString()
  catalogItemId?: string;

  @IsOptional()
  @IsString()
  customFrameId?: string;

  @ValidateIf((o) => !o.catalogItemId && !o.customFrameId)
  _?: never;
}
