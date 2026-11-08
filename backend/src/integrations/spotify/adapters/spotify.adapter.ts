import { Injectable, Logger } from '@nestjs/common';
import { SpotifyApiClient } from '../clients/spotify-api.client';
import {
  NormalizedListeningRecord,
  SpotifyPlayHistoryMapper,
} from '../mappers/spotify-play-history.mapper';

@Injectable()
export class SpotifyAdapter {
  private readonly logger = new Logger(SpotifyAdapter.name);

  constructor(private readonly client: SpotifyApiClient) {}

  async getRecentPlays(
    accessToken: string,
    userId: string,
    connectionId: string,
    afterTimestamp?: number,
  ): Promise<NormalizedListeningRecord[]> {
    const rawData = await this.client.fetchRecentlyPlayed(
      accessToken,
      afterTimestamp,
    );
    return (rawData.items || []).map((item) =>
      SpotifyPlayHistoryMapper.toNormalized(item, userId, connectionId),
    );
  }
}
