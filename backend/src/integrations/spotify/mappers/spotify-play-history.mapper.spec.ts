import { SpotifyPlayHistoryMapper } from './spotify-play-history.mapper';
import { SpotifyPlayHistoryItem } from '../types/spotify-api.types';
import { MusicProvider } from '@prisma/client';

describe('SpotifyPlayHistoryMapper', () => {
  const mockPlayItem: SpotifyPlayHistoryItem = {
    track: {
      id: 'track_123',
      name: 'Bohemian Rhapsody',
      duration_ms: 354000,
      uri: 'spotify:track:track_123',
      artists: [
        {
          id: 'artist_queen',
          name: 'Queen',
          uri: 'spotify:artist:artist_queen',
          href: 'https://api.spotify.com/v1/artists/artist_queen',
        },
      ],
      album: {
        id: 'album_anato',
        name: 'A Night at the Opera',
        album_type: 'album',
        uri: 'spotify:album:album_anato',
      },
    },
    played_at: '2026-11-08T12:00:00.000Z',
    context: null,
  };

  it('should map SpotifyPlayHistoryItem to NormalizedListeningRecord correctly', () => {
    const userId = 'user_uuid_1';
    const connectionId = 'conn_uuid_1';
    const normalized = SpotifyPlayHistoryMapper.toNormalized(
      mockPlayItem,
      userId,
      connectionId,
    );

    expect(normalized.userId).toBe(userId);
    expect(normalized.connectionId).toBe(connectionId);
    expect(normalized.provider).toBe(MusicProvider.SPOTIFY);
    expect(normalized.providerTrackId).toBe('track_123');
    expect(normalized.trackName).toBe('Bohemian Rhapsody');
    expect(normalized.artistNames).toEqual(['Queen']);
    expect(normalized.albumName).toBe('A Night at the Opera');
    expect(normalized.trackDurationMs).toBe(354000);
    expect(normalized.playedAt.toISOString()).toBe('2026-11-08T12:00:00.000Z');
  });

  it('strictly enforces Honest Data Rule: all 6 playback duration inference fields are null', () => {
    const normalized = SpotifyPlayHistoryMapper.toNormalized(
      mockPlayItem,
      'u1',
      'c1',
    );

    expect(normalized.startedAt).toBeNull();
    expect(normalized.endedAt).toBeNull();
    expect(normalized.listenedDurationMs).toBeNull();
    expect(normalized.startProgressMs).toBeNull();
    expect(normalized.endProgressMs).toBeNull();
    expect(normalized.completionRate).toBeNull();
  });
});
