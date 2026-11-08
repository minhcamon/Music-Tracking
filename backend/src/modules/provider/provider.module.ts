import { Module } from '@nestjs/common';
import { ProviderService } from './services/provider.service';
import { ProviderController } from './controllers/provider.controller';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
