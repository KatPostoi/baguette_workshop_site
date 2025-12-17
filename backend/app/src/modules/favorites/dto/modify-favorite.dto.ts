import { IsNotEmpty, IsString } from 'class-validator';

export class ModifyFavoriteDto {
  @IsString()
  @IsNotEmpty()
  catalogItemId!: string;
}
