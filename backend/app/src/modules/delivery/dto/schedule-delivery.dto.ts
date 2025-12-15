import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ScheduleDeliveryDto {
  @IsUUID()
  orderId!: string;

  @IsOptional()
  @IsString()
  courierService?: string;
}
