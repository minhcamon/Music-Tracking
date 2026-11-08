import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SpotifyRecentlyPlayedResponse } from '../types/spotify-api.types';

@Injectable()
export class SpotifyApiClient {
  private readonly logger = new Logger(SpotifyApiClient.name);
  private readonly baseUrl = 'https://api.spotify.com/v1';

  constructor(private readonly httpService: HttpService) {}

  async fetchRecentlyPlayed(
    accessToken: string,
    afterTimestamp?: number,
    limit = 50,
  ): Promise<SpotifyRecentlyPlayedResponse> {
    const params: Record<string, string | number> = { limit };
    if (afterTimestamp) {
      params.after = afterTimestamp;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<SpotifyRecentlyPlayedResponse>(
          `${this.baseUrl}/me/player/recently-played`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params,
          },
        ),
      );
      return response.data;
    } catch (error) {
      // Security Policy: Never log the raw request config or Bearer tokens
      const err = error as { response?: { status: number }; message: string };
      this.logger.error(
        `[SPOTIFY_API_ERROR] status=${err.response?.status} message=${err.message}`,
      );
      throw error;
    }
  }
}
