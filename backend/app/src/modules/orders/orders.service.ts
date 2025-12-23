import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CatalogService } from '../catalog/catalog.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderResponse,
  OrderStatusHistoryResponse,
} from './dto/order.response';
import { NotificationsService } from '../notifications/notifications.service';
import { OrderTimelineResponse } from './dto/order-timeline.response';
import { AdminOrderFilterDto } from './dto/admin-order-filter.dto';
import { AssignTeamDto } from './dto/assign-team.dto';
import { ORDER_STATUS, type OrderStatus } from './order-status';
import { AuditService } from '../audit/audit.service';
import { CustomFramesService } from '../custom-frames/custom-frames.service';
import { FrameSource } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogService: CatalogService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
    private readonly customFramesService: CustomFramesService,
  ) {}

  async list(params: {
    userId: string | null;
    allowAll?: boolean;
    filters?: AdminOrderFilterDto;
    includeHistory?: boolean;
  }): Promise<OrderResponse[]> {
    const {
      userId,
      allowAll = false,
      filters,
      includeHistory = false,
    } = params;
    const where: Prisma.OrderWhereInput = allowAll
      ? {}
      : { userId: userId ?? undefined };

    if (allowAll && filters) {
      where.status = filters.status ?? undefined;
      if (filters.userId) {
        where.userId = filters.userId;
      }
      if (filters.teamId) {
        where.teamId = filters.teamId;
      }
      if (filters.from || filters.to) {
        where.createdAt = {
          gte: filters.from ?? undefined,
          lte: filters.to ?? undefined,
        };
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: true,
        team: true,
        history: includeHistory
          ? {
              orderBy: { createdAt: 'desc' },
              include: { actor: true },
            }
          : false,
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.mapToResponse(order));
  }

  async getById(params: {
    id: string;
    userId: string | null;
    allowAll?: boolean;
    includeHistory?: boolean;
  }): Promise<OrderResponse> {
    const { id, userId, allowAll = false, includeHistory = true } = params;
    const order = await this.prisma.order.findUnique({
      where: allowAll ? { id } : { id, userId: userId ?? undefined },
      include: {
        items: true,
        team: true,
        history: includeHistory
          ? {
              orderBy: { createdAt: 'desc' },
              include: { actor: true },
            }
          : false,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.mapToResponse(order);
  }

  async create(
    dto: CreateOrderDto,
    userId: string | null,
  ): Promise<OrderResponse> {
    if (!dto.items?.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const enrichedItems = await Promise.all(
      dto.items.map(async (item) => {
        if (item.customFrameId) {
          if (!userId) {
            throw new BadRequestException(
              'Кастомные рамы доступны только авторизованным пользователям',
            );
          }
          const frame = await this.customFramesService.getById(
            item.customFrameId,
            userId ?? '',
          );
          return {
            customFrameId: frame.id,
            catalogItemId: null,
            slug: frame.slug,
            title: frame.title,
            price: frame.price,
            quantity: item.quantity,
            imageUrl: frame.image.src,
            imageAlt: frame.image.alt,
            widthCm: frame.size.widthCm,
            heightCm: frame.size.heightCm,
            color: frame.color ?? null,
            source: FrameSource.CUSTOM,
          };
        }

        if (!item.catalogItemId) {
          throw new BadRequestException(
            'Укажите товар каталога или кастомную раму',
          );
        }

        const summary = await this.catalogService.findOneById(
          item.catalogItemId,
        );
        return {
          catalogItemId: summary.id,
          customFrameId: null,
          slug: summary.slug,
          title: summary.title,
          price: summary.price,
          quantity: item.quantity,
          imageUrl: summary.image.src,
          imageAlt: summary.image.alt,
          widthCm: summary.size.widthCm,
          heightCm: summary.size.heightCm,
          color: summary.color,
          source: FrameSource.DEFAULT,
        };
      }),
    );

    const total = enrichedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: userId ?? null,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          deliveryAddress: dto.deliveryAddress,
          status: ORDER_STATUS.PENDING as any,
          total,
          items: {
            createMany: {
              data: enrichedItems,
            },
          },
        },
        include: { items: true },
      });

      if (dto.clearBasketAfterOrder && userId) {
        await tx.basketItem.deleteMany({ where: { userId } });
      }

      return created;
    });

    await this.recordHistory(
      order.id,
      ORDER_STATUS.PENDING,
      null,
      'Заказ создан, ожидает оплаты',
    );
    await this.notificationsService.record(
      order.id,
      'order_created',
      `Order created for ${dto.customerEmail}`,
    );
    return this.buildOrderResponse(order.id);
  }

  async updateStatus(params: {
    orderId: string;
    status: OrderStatus;
    userId: string | null;
    allowAll?: boolean;
    comment?: string | null;
  }): Promise<OrderResponse> {
    const { orderId, status, userId, allowAll = false, comment } = params;
    const order = await this.prisma.order.findUnique({
      where: allowAll
        ? { id: orderId }
        : { id: orderId, userId: userId ?? undefined },
      include: { items: true, team: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (!this.isTransitionAllowed(order, status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${status}`,
      );
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    await this.recordHistory(orderId, status, userId, comment ?? undefined);
    await this.notificationsService.record(
      orderId,
      'order_status_changed',
      `Статус изменён на ${status}`,
    );
    await this.auditService.record({
      actorId: userId ?? undefined,
      action: 'order_status_change',
      entity: 'Order',
      entityId: orderId,
      before: { status: order.status },
      after: { status },
      meta: { comment },
    });

    return this.buildOrderResponse(orderId);
  }

  async getTimeline(params: {
    orderId: string;
    userId: string | null;
    allowAll?: boolean;
  }): Promise<OrderTimelineResponse> {
    const { orderId, userId, allowAll = false } = params;
    await this.getById({ id: orderId, userId, allowAll }); // ensure order exists and owned by user
    const notifications = await this.notificationsService.listByOrder(orderId);
    const history = await this.prisma.orderStatusHistory.findMany({
      where: { orderId },
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
    });
    return {
      orderId,
      notifications,
      history: history.map((entry) => this.mapHistory(entry)),
    };
  }

  async bulkUpdateStatus(params: {
    orderIds: string[];
    status: OrderStatus;
    userId: string;
    comment?: string | null;
  }): Promise<OrderResponse[]> {
    const { orderIds, status, userId, comment } = params;

    const orders = await this.prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: { items: true, team: true },
    });

    if (orders.length !== orderIds.length) {
      const missing = orderIds.filter(
        (id) => !orders.find((order) => order.id === id),
      );
      throw new NotFoundException(`Orders not found: ${missing.join(', ')}`);
    }

    orders.forEach((order) => {
      if (!this.isTransitionAllowed(order, status)) {
        throw new BadRequestException(
          `Cannot change status from ${order.status} to ${status} for order ${order.id}`,
        );
      }
    });

    await this.prisma.$transaction(
      orders.map((order) =>
        this.prisma.order.update({
          where: { id: order.id },
          data: { status },
        }),
      ),
    );

    await Promise.all(
      orders.map((order) =>
        this.notificationsService.record(
          order.id,
          'order_status_changed',
          `Status -> ${status} (bulk by ${userId})`,
        ),
      ),
    );

    await Promise.all(
      orders.map((order) =>
        this.recordHistory(order.id, status, userId, comment ?? undefined),
      ),
    );
    await this.auditService.record({
      actorId: userId,
      action: 'order_status_bulk_change',
      entity: 'Order',
      entityId: orderIds.join(','),
      before: { ids: orderIds },
      after: { status },
      meta: { comment },
    });

    return Promise.all(orderIds.map((id) => this.buildOrderResponse(id)));
  }

  async assignTeam(
    orderId: string,
    dto: AssignTeamDto,
    actorId: string | null,
  ): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, team: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId, active: true },
    });

    if (!team) {
      throw new NotFoundException(`Team ${dto.teamId} not found or inactive`);
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { teamId: dto.teamId },
      include: {
        items: true,
        team: true,
        history: { include: { actor: true } },
      },
    });

    await this.recordHistory(
      orderId,
      updated.status,
      actorId,
      `Назначена команда: ${team.name}`,
    );
    await this.auditService.record({
      actorId,
      action: 'order_team_assigned',
      entity: 'Order',
      entityId: orderId,
      before: { teamId: order.teamId },
      after: { teamId: dto.teamId, teamName: team.name },
    });

    return this.mapToResponse(updated);
  }

  async cancel(orderId: string, userId: string): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, userId },
      include: { items: true, team: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const allowed = new Set<OrderStatus>([
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PAID,
      ORDER_STATUS.ASSEMBLY,
      ORDER_STATUS.READY_FOR_PICKUP,
    ]);
    if (!allowed.has(order.status)) {
      throw new ForbiddenException('Order cannot be cancelled at this stage');
    }

    return this.updateStatus({
      orderId,
      status: ORDER_STATUS.CANCELLED,
      userId,
      allowAll: false,
      comment: 'Отмена пользователем',
    });
  }

  async pay(orderId: string, userId: string): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, userId },
      include: {
        items: true,
        team: true,
        history: { include: { actor: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new BadRequestException(
        'Order already processed or cannot be paid',
      );
    }

    await this.recordHistory(
      orderId,
      ORDER_STATUS.PAID,
      userId,
      'Оплачено (демо-провайдер)',
    );
    await this.notificationsService.record(
      orderId,
      'order_paid',
      'Оплата прошла успешно (демо)',
    );
    await this.auditService.record({
      actorId: userId,
      action: 'order_pay',
      entity: 'Order',
      entityId: orderId,
      before: { status: order.status },
      after: { status: ORDER_STATUS.PAID },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.PAID },
    });

    return this.buildOrderResponse(orderId);
  }

  private mapToResponse(order: {
    id: string;
    status: OrderStatus;
    total: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    deliveryAddress: string | null;
    createdAt: Date;
    items: Array<{
      id: string;
      catalogItemId: string | null;
      customFrameId: string | null;
      title: string;
      slug: string;
      price: number;
      quantity: number;
      imageUrl: string;
      imageAlt: string;
      widthCm: number;
      heightCm: number;
      color: string | null;
      source: FrameSource;
    }>;
    team?: { id: string; name: string } | null;
    history?: Array<{
      id: string;
      status: OrderStatus;
      comment: string | null;
      createdAt: Date;
      actor?: { id: string; fullName: string; role: string } | null;
    }>;
  }): OrderResponse {
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      team: order.team
        ? {
            id: order.team.id,
            name: order.team.name,
          }
        : null,
      history: order.history?.map((h) => this.mapHistory(h)),
      items: order.items.map((item) => ({
        id: item.id,
        catalogItemId: item.catalogItemId,
        title: item.title,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        image: {
          src: item.imageUrl,
          alt: item.imageAlt,
        },
        size: {
          widthCm: item.widthCm,
          heightCm: item.heightCm,
        },
        color: item.color ?? null,
        source:
          item.source === FrameSource.CUSTOM ? 'custom' : ('default' as const),
        customFrameId: item.customFrameId ?? undefined,
      })),
    };
  }

  private isTransitionAllowed(
    order: { status: OrderStatus; deliveryAddress?: string | null },
    next: OrderStatus,
  ): boolean {
    const current = order.status;
    const allowDeliveryPath = Boolean(order.deliveryAddress);

    const allowedMap: Record<OrderStatus, OrderStatus[]> = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PAID]: [ORDER_STATUS.ASSEMBLY, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.ASSEMBLY]: [
        ORDER_STATUS.READY_FOR_PICKUP,
        ORDER_STATUS.IN_TRANSIT,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.READY_FOR_PICKUP]: [
        ORDER_STATUS.RECEIVED,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.IN_TRANSIT]: [
        ORDER_STATUS.RECEIVED,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.RECEIVED]: [ORDER_STATUS.COMPLETED],
      [ORDER_STATUS.COMPLETED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };

    if (next === ORDER_STATUS.IN_TRANSIT && !allowDeliveryPath) {
      return false;
    }

    return allowedMap[current]?.includes(next) ?? false;
  }

  private mapHistory(history: {
    id: string;
    status: OrderStatus;
    comment: string | null;
    createdAt: Date;
    actor?: { id: string; fullName: string; role: string } | null;
  }): OrderStatusHistoryResponse {
    return {
      id: history.id,
      status: history.status,
      comment: history.comment,
      createdAt: history.createdAt,
      changedBy: history.actor
        ? {
            id: history.actor.id,
            fullName: history.actor.fullName,
            role: history.actor.role,
          }
        : null,
    };
  }

  private async recordHistory(
    orderId: string,
    status: OrderStatus,
    userId: string | null,
    comment?: string,
  ): Promise<void> {
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        changedBy: userId ?? undefined,
        comment,
      },
    });
  }

  private async buildOrderResponse(orderId: string): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        team: true,
        history: {
          include: { actor: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    return this.mapToResponse(order);
  }
}
