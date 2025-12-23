import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './dto/order.response';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderTimelineResponse } from './dto/order-timeline.response';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AssignTeamDto } from './dto/assign-team.dto';
import { AdminOrderFilterDto } from './dto/admin-order-filter.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query() filters: AdminOrderFilterDto,
  ): Promise<OrderResponse[]> {
    const isAdmin = user.role === 'ADMIN';
    return this.ordersService.list({
      userId: user.sub,
      allowAll: isAdmin,
      filters: isAdmin ? filters : undefined,
      includeHistory: !isAdmin,
    });
  }

  @Get(':id')
  get(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse> {
    const isAdmin = user.role === 'ADMIN';
    return this.ordersService.getById({
      id,
      userId: user.sub,
      allowAll: isAdmin,
    });
  }

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse> {
    return this.ordersService.create(dto, user.sub);
  }

  @Get(':id/timeline')
  timeline(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderTimelineResponse> {
    const isAdmin = user.role === 'ADMIN';
    return this.ordersService.getTimeline({
      orderId: id,
      userId: user.sub,
      allowAll: isAdmin,
    });
  }

  @Patch(':id/status')
  @Roles('ADMIN')
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

  @Patch(':id/team')
  @Roles('ADMIN')
  assignTeam(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignTeamDto,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse> {
    return this.ordersService.assignTeam(id, dto, user.sub);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse> {
    return this.ordersService.cancel(id, user.sub);
  }

  @Patch(':id/pay')
  pay(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<OrderResponse> {
    return this.ordersService.pay(id, user.sub);
  }
}
