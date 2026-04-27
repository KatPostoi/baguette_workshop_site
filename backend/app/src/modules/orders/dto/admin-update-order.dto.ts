import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ORDER_STATUS } from '../order-status';

export class AdminUpdateOrderDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  customerName?: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string | null;

  @IsString()
  @IsOptional()
  deliveryAddress?: string | null;

  @IsUUID()
  @IsOptional()
  teamId?: string | null;

  @IsString()
  @IsIn(Object.values(ORDER_STATUS))
  @IsOptional()
  status?: string;
}
