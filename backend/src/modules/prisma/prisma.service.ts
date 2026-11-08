import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    // Lazy connection on demand ensures the application boots and healthchecks
    // succeed even when PostgreSQL daemon is offline or in development environments.
    this.logger.log('PrismaService initialized (lazy connection mode).');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
