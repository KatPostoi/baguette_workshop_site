import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class UpdateQuantityDto {
  @IsUUID()
  @IsNotEmpty()
  catalogItemId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(99)
  quantity!: number;
}
