import { IsNotEmpty, IsUUID } from 'class-validator';

export class ModifyFavoriteDto {
  @IsUUID()
  @IsNotEmpty()
  catalogItemId!: string;
}
