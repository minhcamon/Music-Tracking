import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SyncTriggerDto } from '../dto/sync-trigger.dto';
import { SyncStatus } from '@prisma/client';

export interface SyncExecutionResult {
  connectionId: string;
  status: SyncStatus;
  syncedCount: number;
}

@Injectable()
export class SynchronizationService {
  private readonly logger = new Logger(SynchronizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async triggerSync(dto: SyncTriggerDto): Promise<SyncExecutionResult> {
    this.logger.log(`Sync triggered for connection=${dto.connectionId}`);
    return {
      connectionId: dto.connectionId,
      status: SyncStatus.IDLE,
      syncedCount: 0,
    };
  }
}
