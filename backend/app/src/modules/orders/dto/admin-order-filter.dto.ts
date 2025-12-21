import { IsDate, IsIn, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ORDER_STATUS_LIST, type OrderStatus } from '../order-status';

export class AdminOrderFilterDto {
  @IsOptional()
  @IsIn(ORDER_STATUS_LIST)
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;
}
