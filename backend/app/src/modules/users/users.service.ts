import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UserProfileResponse } from './dto/user-profile.response';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublicProfiles(): Promise<UserProfileResponse[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users.map((user) => this.toProfile(user));
  }

  async getPublicProfile(id: string): Promise<UserProfileResponse> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.toProfile(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  toProfile(user: User): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
