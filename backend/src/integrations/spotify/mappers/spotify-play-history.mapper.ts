import { MusicProvider } from '@prisma/client';
import { SpotifyPlayHistoryItem } from '../types/spotify-api.types';

export interface NormalizedListeningRecord {
  userId: string;
  provider: MusicProvider;
  connectionId: string;
  providerTrackId: string;
  trackName: string;
  artistNames: string[];
  albumName: string | null;
  trackDurationMs: number;
  playedAt: Date;
  rawPayload: Record<string, unknown>;

  // Honest Data Rule: Strictly null; never inferred
  startedAt: null;
  endedAt: null;
  listenedDurationMs: null;
  startProgressMs: null;
  endProgressMs: null;
  completionRate: null;
}

export class SpotifyPlayHistoryMapper {
  /**
   * Maps a Spotify recently played item to a normalized record.
   * Adheres strictly to the Honest Data Rule (ADR-0005): all duration/progress
   * inference fields are set to null.
   */
  public static toNormalized(
    item: SpotifyPlayHistoryItem,
    userId: string,
    connectionId: string,
  ): NormalizedListeningRecord {
    return {
      userId,
      provider: MusicProvider.SPOTIFY,
      connectionId,
      providerTrackId: item.track.id,
      trackName: item.track.name,
      artistNames: (item.track.artists || []).map((a) => a.name),
      albumName: item.track.album?.name || null,
      trackDurationMs: item.track.duration_ms,
      playedAt: new Date(item.played_at),
      rawPayload: item as unknown as Record<string, unknown>,

      // Invariants: Honest Data Rule
      startedAt: null,
      endedAt: null,
      listenedDurationMs: null,
      startProgressMs: null,
      endProgressMs: null,
      completionRate: null,
    };
  }
}
