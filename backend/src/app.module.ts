import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { ProviderModule } from './modules/provider/provider.module';
import { ListeningModule } from './modules/listening/listening.module';
import { SynchronizationModule } from './modules/synchronization/synchronization.module';
import { SpotifyModule } from './integrations/spotify/spotify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    ProviderModule,
    ListeningModule,
    SynchronizationModule,
    SpotifyModule,
  ],
})
export class AppModule {}
