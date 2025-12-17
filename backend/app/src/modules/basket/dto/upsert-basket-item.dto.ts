import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertBasketItemDto {
  @IsString()
  @IsNotEmpty()
  catalogItemId!: string;
}
