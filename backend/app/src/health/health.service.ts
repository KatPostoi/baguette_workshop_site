import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
  timestamp: string;
  env: string;
}

@Injectable()
export class HealthService {
  getStatus(nodeEnv: string): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: nodeEnv,
    };
  }
}
