import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class ModifyFavoriteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  catalogItemId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customFrameId?: string;

  @ValidateIf((o) => !o.catalogItemId && !o.customFrameId)
  _?: never;
}
