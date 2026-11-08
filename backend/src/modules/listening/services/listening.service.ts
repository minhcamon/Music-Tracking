import { Injectable } from '@nestjs/common';
import { ListeningEventRepository } from '../repositories/listening-event.repository';
import { ListeningEvent } from '@prisma/client';

@Injectable()
export class ListeningService {
  constructor(
    private readonly listeningRepository: ListeningEventRepository,
  ) {}

  async getRecentHistory(limit = 50): Promise<ListeningEvent[]> {
    return this.listeningRepository.findRecent(limit);
  }
}
