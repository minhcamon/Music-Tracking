import { Module } from '@nestjs/common';
import { SynchronizationController } from './controllers/synchronization.controller';
import { SynchronizationService } from './services/synchronization.service';
import { SyncScheduler } from './schedulers/sync.scheduler';

@Module({
  controllers: [SynchronizationController],
  providers: [SynchronizationService, SyncScheduler],
  exports: [SynchronizationService],
})
export class SynchronizationModule {}
