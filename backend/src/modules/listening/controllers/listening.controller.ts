import { Controller, Get, Query } from '@nestjs/common';
import { ApiPaths } from '../../../common/constants/api-paths.constant';
import { ListeningService } from '../services/listening.service';
import { ListeningEvent } from '@prisma/client';

@Controller(ApiPaths.LISTENING_EVENTS)
export class ListeningController {
  constructor(private readonly listeningService: ListeningService) {}

  @Get()
  async getRecent(
    @Query('limit') limit?: string,
  ): Promise<ListeningEvent[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.listeningService.getRecentHistory(parsedLimit);
  }
}
