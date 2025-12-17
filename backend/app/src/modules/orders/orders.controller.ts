import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './dto/order.response';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderTimelineResponse } from './dto/order-timeline.response';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(): Promise<OrderResponse[]> {
    return this.ordersService.list();
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<OrderResponse> {
    return this.ordersService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<OrderResponse> {
    return this.ordersService.create(dto);
  }

  @Get(':id/timeline')
  timeline(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OrderTimelineResponse> {
    return this.ordersService.getTimeline(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderResponse> {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
