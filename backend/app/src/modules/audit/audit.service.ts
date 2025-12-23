import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(params: {
    actorId?: string | null;
    action: string;
    entity: string;
    entityId: string;
    before?: unknown;
    after?: unknown;
    meta?: unknown;
  }) {
    const { actorId, action, entity, entityId, before, after, meta } = params;
    await (this.prisma as any).auditEvent.create({
      data: {
        actorId: actorId ?? null,
        action,
        entity,
        entityId,
        before: before as any,
        after: after as any,
        meta: meta as any,
      },
    });
  }

  async list(params: {
    actorId?: string;
    entity?: string;
    action?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }) {
    type AuditEventWithActor = Prisma.AuditEventGetPayload<{
      include: {
        actor: {
          select: { id: true; fullName: true; email: true; role: true };
        };
      };
    }>;

    const where: Prisma.AuditEventWhereInput = {};
    if (params.actorId) {
      where.actorId = params.actorId;
    }
    if (params.entity) {
      where.entity = params.entity;
    }
    if (params.action) {
      where.action = params.action;
    }
    if (params.from || params.to) {
      where.createdAt = {
        gte: params.from ?? undefined,
        lte: params.to ?? undefined,
      };
    }

    const take = Math.min(params.limit ?? 100, 500);
    const skip = params.offset ?? 0;

    const [events, total] = await Promise.all([
      (this.prisma as any).auditEvent.findMany({
        where,
        include: {
          actor: {
            select: { id: true, fullName: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      (this.prisma as any).auditEvent.count({ where }),
    ]);

    const typedEvents = events as AuditEventWithActor[];

    return {
      items: typedEvents.map((event) => ({
        id: event.id,
        actor: event.actor,
        action: event.action,
        entity: event.entity,
        entityId: event.entityId,
        before: event.before,
        after: event.after,
        meta: event.meta,
        createdAt: event.createdAt,
      })),
      total,
    };
  }
}
