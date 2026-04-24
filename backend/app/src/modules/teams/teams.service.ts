import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list(params: { includeInactive?: boolean } = {}) {
    const { includeInactive = false } = params;

    return this.prisma.team.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateTeamDto) {
    const created = await this.prisma.team.create({
      data: { name: dto.name.trim() },
    });

    await this.audit.record({
      action: 'team_create',
      entity: 'Team',
      entityId: created.id,
      after: created,
    });

    return created;
  }

  async update(id: string, dto: UpdateTeamDto) {
    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Team ${id} not found`);
    }

    const updated = await this.prisma.team.update({
      where: { id },
      data: {
        name: dto.name?.trim() ?? existing.name,
        active: dto.active ?? existing.active,
      },
    });

    await this.audit.record({
      action: 'team_update',
      entity: 'Team',
      entityId: id,
      before: existing,
      after: updated,
    });

    return updated;
  }

  async deactivate(id: string) {
    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Team ${id} not found`);
    }

    if (!existing.active) {
      return existing;
    }

    const updated = await this.prisma.team.update({
      where: { id },
      data: { active: false },
    });

    await this.audit.record({
      action: 'team_deactivate',
      entity: 'Team',
      entityId: id,
      before: existing,
      after: updated,
    });

    return updated;
  }
}
