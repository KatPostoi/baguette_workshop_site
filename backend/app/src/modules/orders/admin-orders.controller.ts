import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthUser } from '../auth/types';
import { CurrentUser } from '../auth/current-user.decorator';
import { AdminOrderFilterDto } from './dto/admin-order-filter.dto';
import { OrderResponse } from './dto/order.response';
import { OrderTimelineResponse } from './dto/order-timeline.response';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { BulkUpdateStatusDto } from './dto/bulk-update-status.dto';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@Query() filters: AdminOrderFilterDto): Promise<OrderResponse[]> {
    return this.ordersService.list({
      userId: null,
      allowAll: true,
      filters,
    });
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<OrderResponse> {
    return this.ordersService.getById({
      id,
      userId: null,
      allowAll: true,
    });
  }

  @Get(':id/timeline')
  timeline(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OrderTimelineResponse> {
    return this.ordersService.getTimeline({
      orderId: id,
      userId: null,
      allowAll: true,
    });
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse> {
    return this.ordersService.updateStatus({
      orderId: id,
      status: dto.status,
      userId: user.sub,
      allowAll: true,
      comment: dto.comment,
    });
  }

  @Patch('bulk/status')
  bulkUpdate(
    @Body() dto: BulkUpdateStatusDto,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse[]> {
    return this.ordersService.bulkUpdateStatus({
      orderIds: dto.orderIds,
      status: dto.status,
      userId: user.sub,
      comment: dto.comment,
    });
  }
}
