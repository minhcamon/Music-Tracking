import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpotifyApiClient } from './clients/spotify-api.client';
import { SpotifyAdapter } from './adapters/spotify.adapter';

@Module({
  imports: [HttpModule],
  providers: [SpotifyApiClient, SpotifyAdapter],
  exports: [SpotifyAdapter],
})
export class SpotifyModule {}
