import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpsertBasketItemDto {
  @IsUUID()
  @IsNotEmpty()
  catalogItemId!: string;
}
