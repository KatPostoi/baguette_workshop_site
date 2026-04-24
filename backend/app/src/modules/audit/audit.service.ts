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
    await this.prisma.auditEvent.create({
      data: {
        actorId: actorId ?? null,
        action,
        entity,
        entityId,
        before: this.toAuditJson(before),
        after: this.toAuditJson(after),
        meta: this.toAuditJson(meta),
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
      this.prisma.auditEvent.findMany({
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
      this.prisma.auditEvent.count({ where }),
    ]);

    return {
      items: events.map((event: AuditEventWithActor) => ({
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

  private toAuditJson(
    value: unknown,
  ): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return Prisma.JsonNull;
    }

    return this.normalizeJsonValue(value);
  }

  private normalizeJsonValue(value: unknown): Prisma.InputJsonValue {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        item === undefined ? null : this.normalizeJsonValue(item),
      );
    }

    if (value && typeof value === 'object') {
      const normalized: Record<string, Prisma.InputJsonValue | null> = {};

      Object.entries(value).forEach(([key, nestedValue]) => {
        if (nestedValue !== undefined) {
          normalized[key] =
            nestedValue === null ? null : this.normalizeJsonValue(nestedValue);
        }
      });

      return normalized;
    }

    if (typeof value === 'symbol' || typeof value === 'function') {
      return String(value);
    }

    return 'unsupported-audit-value';
  }
}
