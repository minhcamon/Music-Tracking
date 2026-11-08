import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ListeningEvent } from '@prisma/client';

@Injectable()
export class ListeningEventRepository {
  private readonly logger = new Logger(ListeningEventRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findRecent(limit = 50): Promise<ListeningEvent[]> {
    try {
      return await this.prisma.listeningEvent.findMany({
        take: limit,
        orderBy: { playedAt: 'desc' },
      });
    } catch (error) {
      this.logger.warn(
        `Database query failed in findRecent: ${(error as Error).message}`,
      );
      return [];
    }
  }
}
