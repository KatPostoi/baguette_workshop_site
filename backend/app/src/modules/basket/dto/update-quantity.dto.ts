import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateQuantityDto {
  @IsString()
  @IsNotEmpty()
  catalogItemId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(99)
  quantity!: number;
}
