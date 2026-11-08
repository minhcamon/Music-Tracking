import { Body, Controller, Post } from '@nestjs/common';
import { ApiPaths } from '../../../common/constants/api-paths.constant';
import {
  SynchronizationService,
  SyncExecutionResult,
} from '../services/synchronization.service';
import { SyncTriggerDto } from '../dto/sync-trigger.dto';

@Controller(ApiPaths.SYNCHRONIZATION)
export class SynchronizationController {
  constructor(
    private readonly syncService: SynchronizationService,
  ) {}

  @Post('trigger')
  async trigger(
    @Body() dto: SyncTriggerDto,
  ): Promise<SyncExecutionResult> {
    return this.syncService.triggerSync(dto);
  }
}
