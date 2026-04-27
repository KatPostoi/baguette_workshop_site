import { IsOptional, IsUUID } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class AdminCreateOrderDto extends CreateOrderDto {
  @IsUUID()
  @IsOptional()
  teamId?: string | null;
}
