import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User, UserRole } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUserFilterDto } from './dto/admin-user-filter.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponse } from './dto/user-profile.response';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getPublicProfile(id: string): Promise<UserProfileResponse> {
    const user = await this.findActiveById(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.toProfile(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    return this.isUserActive(user) ? user : null;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findActiveById(id: string): Promise<User | null> {
    const user = await this.findById(id);
    return this.isUserActive(user) ? user : null;
  }

  async searchAdminUsers(
    filters: AdminUserFilterDto,
  ): Promise<UserProfileResponse[]> {
    const users = await this.prisma.user.findMany({
      where: this.buildAdminWhere(filters),
      orderBy: [{ role: 'desc' }, { createdAt: 'desc' }],
    });

    return users.map((user) => this.toProfile(user));
  }

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
    gender?: string;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          fullName: data.fullName,
          phone: data.phone ?? null,
          gender: data.gender ?? null,
          isActive: true,
        },
      });
    } catch (error) {
      this.rethrowUserWriteError(error);
      throw error;
    }
  }

  async createAdminUser(
    dto: AdminCreateUserDto,
    actorId: string,
  ): Promise<UserProfileResponse> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const created = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
          phone: dto.phone ?? null,
          gender: dto.gender ?? null,
          role: dto.role ?? UserRole.CUSTOMER,
          isActive: dto.isActive ?? true,
        },
      });

      await this.audit.record({
        actorId,
        action: 'user_create',
        entity: 'User',
        entityId: created.id,
        after: this.toProfile(created),
      });

      return this.toProfile(created);
    } catch (error) {
      this.rethrowUserWriteError(error);
      throw error;
    }
  }

  toProfile(user: User): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      gender: user.gender ?? null,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfileResponse> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          fullName: dto.fullName,
          phone: dto.phone ?? undefined,
          gender: dto.gender ?? undefined,
        },
      });

      return this.toProfile(user);
    } catch (error) {
      this.rethrowUserWriteError(error);
      throw error;
    }
  }

  async updateAdminUser(
    userId: string,
    dto: AdminUpdateUserDto,
    actorId: string,
  ): Promise<UserProfileResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const nextRole = dto.role ?? existing.role;
    const nextIsActive = dto.isActive ?? existing.isActive;

    await this.assertAdminLifecycleChangeAllowed({
      existing,
      actorId,
      nextRole,
      nextIsActive,
    });

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          fullName: dto.fullName ?? existing.fullName,
          phone: dto.phone !== undefined ? dto.phone : existing.phone,
          gender: dto.gender !== undefined ? dto.gender : existing.gender,
          role: nextRole,
          isActive: nextIsActive,
        },
      });

      await this.audit.record({
        actorId,
        action: 'user_update',
        entity: 'User',
        entityId: userId,
        before: this.toProfile(existing),
        after: this.toProfile(updated),
      });

      return this.toProfile(updated);
    } catch (error) {
      this.rethrowUserWriteError(error);
      throw error;
    }
  }

  async deactivateAdminUser(
    userId: string,
    actorId: string,
  ): Promise<UserProfileResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    await this.assertAdminLifecycleChangeAllowed({
      existing,
      actorId,
      nextRole: existing.role,
      nextIsActive: false,
    });

    if (!existing.isActive) {
      return this.toProfile(existing);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    await this.audit.record({
      actorId,
      action: 'user_deactivate',
      entity: 'User',
      entityId: userId,
      before: this.toProfile(existing),
      after: this.toProfile(updated),
    });

    return this.toProfile(updated);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!matches) {
      throw new UnauthorizedException('Invalid current password');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }

  private buildAdminWhere(filters: AdminUserFilterDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async assertAdminLifecycleChangeAllowed(params: {
    existing: User;
    actorId: string;
    nextRole: UserRole;
    nextIsActive: boolean;
  }) {
    const { existing, actorId, nextRole, nextIsActive } = params;
    const removesAdminAccess =
      existing.role === UserRole.ADMIN &&
      existing.isActive &&
      (!nextIsActive || nextRole !== UserRole.ADMIN);

    if (
      existing.id === actorId &&
      existing.role === UserRole.ADMIN &&
      (!nextIsActive || nextRole !== UserRole.ADMIN)
    ) {
      throw new BadRequestException(
        'Нельзя деактивировать или разжаловать текущего администратора через админку',
      );
    }

    if (!removesAdminAccess) {
      return;
    }

    const activeAdmins = await this.prisma.user.count({
      where: {
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    if (activeAdmins <= 1) {
      throw new BadRequestException(
        'Нельзя деактивировать или разжаловать последнего активного администратора',
      );
    }
  }

  private rethrowUserWriteError(error: unknown): never | void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const targets = Array.isArray(error.meta?.target)
        ? error.meta.target.map(String)
        : [];

      if (targets.includes('email')) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }

      if (targets.includes('phone')) {
        throw new ConflictException(
          'Пользователь с таким телефоном уже существует',
        );
      }

      throw new ConflictException(
        'Пользователь с такими данными уже существует',
      );
    }
  }

  private isUserActive(user: User | null): user is User {
    return Boolean(user?.isActive);
  }
}
