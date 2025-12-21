import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.team.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateTeamDto) {
    return await this.prisma.team.create({ data: { name: dto.name } });
  }

  async update(id: string, dto: UpdateTeamDto) {
    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Team ${id} not found`);
    }
    return await this.prisma.team.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        active: dto.active ?? existing.active,
      },
    });
  }
}
