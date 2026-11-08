import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProviderStatusDto } from '../dto/provider-status.dto';

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);

  constructor(private readonly prisma: PrismaService) {}

  async listConnections(userId?: string): Promise<ProviderStatusDto[]> {
    try {
      const connections = await this.prisma.providerConnection.findMany({
        where: userId ? { userId } : undefined,
        select: {
          id: true,
          provider: true,
          providerUserId: true,
          status: true,
          connectedAt: true,
          updatedAt: true,
        },
      });
      return connections;
    } catch (error) {
      this.logger.warn(
        `Database query failed in listConnections: ${(error as Error).message}`,
      );
      return [];
    }
  }
}
