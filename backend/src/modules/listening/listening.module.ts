import { Module } from '@nestjs/common';
import { ListeningController } from './controllers/listening.controller';
import { ListeningService } from './services/listening.service';
import { ListeningEventRepository } from './repositories/listening-event.repository';

@Module({
  controllers: [ListeningController],
  providers: [ListeningService, ListeningEventRepository],
  exports: [ListeningService, ListeningEventRepository],
})
export class ListeningModule {}
