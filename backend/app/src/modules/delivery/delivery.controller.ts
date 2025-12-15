import { Body, Controller, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { ScheduleDeliveryDto } from './dto/schedule-delivery.dto';
import { DeliveryBookingResponse } from './dto/delivery-response.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('schedule')
  schedule(@Body() dto: ScheduleDeliveryDto): Promise<DeliveryBookingResponse> {
    return this.deliveryService.schedule(dto);
  }
}
