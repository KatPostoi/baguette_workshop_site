import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ORDER_STATUS_LIST, type OrderStatus } from '../order-status';

export class BulkUpdateStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  orderIds!: string[];

  @IsIn(ORDER_STATUS_LIST)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
