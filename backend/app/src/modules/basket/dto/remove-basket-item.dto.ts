import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveBasketItemDto {
  @IsString()
  @IsNotEmpty()
  catalogItemId!: string;
}
