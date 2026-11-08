import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiPaths } from '../../common/constants/api-paths.constant';

export interface HealthCheckData {
  status: string;
}

@Controller(ApiPaths.HEALTH)
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check(): { code: number; message: string; data: HealthCheckData } {
    return {
      code: 0,
      message: 'OK',
      data: {
        status: 'healthy',
      },
    };
  }
}
