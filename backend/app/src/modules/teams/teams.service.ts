import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
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

  list(params: { search?: string; active?: boolean } = {}) {
    const where: Prisma.TeamWhereInput = {};

    if (params.active !== undefined) {
      where.active = params.active;
    }

    if (params.search) {
      where.OR = [
        { id: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.team.findMany({
      where,
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
  }

  async create(dto: CreateTeamDto) {
    let created: Team;

    try {
      created = await this.prisma.team.create({
        data: { name: dto.name.trim() },
      });
    } catch (error) {
      this.rethrowTeamWriteError(error);
      throw error;
    }

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

    const nextName = dto.name?.trim() ?? existing.name;
    const nextActive = dto.active ?? existing.active;

    await this.ensureCanDeactivate({
      currentActive: existing.active,
      nextActive,
    });

    if (nextName === existing.name && nextActive === existing.active) {
      return existing;
    }

    let updated: Team;

    try {
      updated = await this.prisma.team.update({
        where: { id },
        data: {
          name: nextName,
          active: nextActive,
        },
      });
    } catch (error) {
      this.rethrowTeamWriteError(error);
      throw error;
    }

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

    await this.ensureCanDeactivate({
      currentActive: existing.active,
      nextActive: false,
    });

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

  private async ensureCanDeactivate(params: {
    currentActive: boolean;
    nextActive: boolean;
  }) {
    const { currentActive, nextActive } = params;

    if (!currentActive || nextActive) {
      return;
    }

    const activeTeams = await this.prisma.team.count({
      where: { active: true },
    });

    if (activeTeams <= 1) {
      throw new BadRequestException(
        'Нельзя деактивировать последнюю активную рабочую группу',
      );
    }
  }

  private rethrowTeamWriteError(error: unknown): never | void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Рабочая группа с таким названием уже существует',
      );
    }
  }
}
