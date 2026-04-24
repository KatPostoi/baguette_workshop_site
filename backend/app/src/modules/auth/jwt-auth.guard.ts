import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { AuthUser } from './types';

type RequestWithUser = {
  headers: Record<string, string | undefined>;
  user?: AuthUser;
};

type AuthenticatedDbUser = {
  id: string;
  email: string;
  role: AuthUser['role'];
  isActive?: boolean;
} | null;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);

    try {
      const payload = await this.jwtService.verifyAsync<AuthUser>(token, {
        secret: this.configService.get<string>('app.jwtSecret'),
      });

      const user = (await this.prisma.user.findUnique({
        where: { id: payload.sub },
      })) as AuthenticatedDbUser;

      if (!user || user.isActive === false) {
        throw new UnauthorizedException('User is inactive or not found');
      }

      request.user = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: RequestWithUser): string {
    const authHeader = request.headers.authorization ?? '';
    const [, token] = authHeader.split(' ');
    if (!token) {
      throw new UnauthorizedException('Authorization token is required');
    }
    return token;
  }
}
