import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './dto/auth.response';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from './types';
import { ConfigService } from '@nestjs/config';
import type { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    console.log(passwordHash);

    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone,
      gender: dto.gender,
    });

    return this.buildAuthResponse(user);
  }

  async buildAuthResponse(user: {
    id: string;
    email: string;
    role: UserRole;
  }): Promise<AuthResponse> {
    const payload: AuthUser = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessSecret = this.configService.get<string>('app.jwtSecret') ?? '';
    const refreshSecret =
      this.configService.get<string>('app.jwtRefreshSecret') ?? '';
    const refreshExpires: JwtSignOptions['expiresIn'] =
      (this.configService.get<string>(
        'app.jwtRefreshExpires',
      ) as JwtSignOptions['expiresIn']) ?? '30d';
    const token = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: '7d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpires,
    });

    const profile = await this.usersService.getPublicProfile(user.id);
    return { token, refreshToken, user: profile };
  }

  async getProfile(userId: string): Promise<AuthResponse['user']> {
    return this.usersService.getPublicProfile(userId);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const payload = await this.jwtService
      .verifyAsync<AuthUser>(refreshToken, {
        secret: this.configService.get<string>('app.jwtRefreshSecret'),
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token');
      });
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.buildAuthResponse(user);
  }
}
