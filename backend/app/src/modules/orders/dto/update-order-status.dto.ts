import { IsIn, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUS_LIST, type OrderStatus } from '../order-status';

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUS_LIST)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
