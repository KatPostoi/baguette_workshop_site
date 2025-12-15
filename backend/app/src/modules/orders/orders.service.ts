import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CatalogService } from '../catalog/catalog.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './dto/order.response';
import { NotificationsService } from '../notifications/notifications.service';
import { OrderTimelineResponse } from './dto/order-timeline.response';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogService: CatalogService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async list(): Promise<OrderResponse[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.mapToResponse(order));
  }

  async getById(id: string): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(Order  not found);
    }

    return this.mapToResponse(order);
  }

  async create(dto: CreateOrderDto): Promise<OrderResponse> {
    if (!dto.items?.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const enrichedItems = await Promise.all(
      dto.items.map(async (item) => {
        const summary = await this.catalogService.getSummaryByIdOrThrow(item.catalogItemId);
        return {
          catalogItemId: summary.id,
          slug: summary.slug,
          title: summary.title,
          price: summary.price,
          quantity: item.quantity,
          imageUrl: summary.image.src,
          imageAlt: summary.image.alt,
        };
      }),
    );

    const total = enrichedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await this.prisma.(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: dto.userId ?? null,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          deliveryAddress: dto.deliveryAddress,
          status: OrderStatus.PENDING,
          total,
          items: {
            createMany: {
              data: enrichedItems,
            },
          },
        },
        include: { items: true },
      });

      if (dto.clearBasketAfterOrder && dto.userId) {
        await tx.basketItem.deleteMany({ where: { userId: dto.userId } });
      }

      return created;
    });

    const response = this.mapToResponse(order);
    await this.notificationsService.record(
      response.id,
      'order_created',
      `Order created for ${response.customerEmail}`,
    );
    return response;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (!this.isTransitionAllowed(order.status, status)) {
      throw new BadRequestException(`Cannot change status from ${order.status} to ${status}`);
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    await this.notificationsService.record(orderId, 'order_status_changed', `Status -> ${status}`);

    return this.mapToResponse(updated);
  }

  async getTimeline(orderId: string): Promise<OrderTimelineResponse> {
    await this.getById(orderId); // ensure order exists
    const notifications = await this.notificationsService.listByOrder(orderId);
    return {
      orderId,
      notifications,
    };
  }

  private mapToResponse(order: Prisma.OrderGetPayload<{ include: { items: true } }>): OrderResponse {
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
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
      })),
    };
  }

  private isTransitionAllowed(current: OrderStatus, next: OrderStatus): boolean {
    const allowedMap: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return allowedMap[current]?.includes(next) ?? false;
  }
}
