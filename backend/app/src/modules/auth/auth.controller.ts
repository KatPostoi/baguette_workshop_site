import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './dto/auth.response';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './types';
import { Public } from './public.decorator';
import { RefreshDto } from './dto/refresh.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const auth = await this.authService.login(dto);
    this.setRefreshCookie(res, auth.refreshToken);
    return { token: auth.token, user: auth.user };
  }

  @Post('register')
  @Public()
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const auth = await this.authService.register(dto);
    this.setRefreshCookie(res, auth.refreshToken);
    return { token: auth.token, user: auth.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): Promise<AuthResponse['user']> {
    return this.authService.getProfile(user.sub);
  }

  @Post('refresh')
  @Public()
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const refreshToken =
      dto.refreshToken ||
      parseCookies(req.headers.cookie ?? '')['refresh_token'] ||
      '';
    const auth = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, auth.refreshToken);
    return { token: auth.token, user: auth.user };
  }

  @Post('logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response): { success: true } {
    res.cookie('refresh_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 0,
      path: '/',
    });
    return { success: true };
  }

  private setRefreshCookie(res: Response, token?: string): void {
    if (!token) return;
    res.cookie('refresh_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // sync with refresh ttl
      path: '/',
    });
  }
}

const parseCookies = (cookieHeader: string): Record<string, string> => {
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
};
