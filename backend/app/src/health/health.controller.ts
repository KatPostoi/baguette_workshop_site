import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthService, HealthStatus } from './health.service';
import { Public } from '../modules/auth/public.decorator';

@Controller()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('health')
  @Public()
  check(): HealthStatus {
    const env = this.configService.get<string>('app.nodeEnv', 'development');
    return this.healthService.getStatus(env);
  }
}
