/**
 * Isolated Spotify Web API types and models.
 * Strictly quarantined within src/integrations/spotify/ per Provider Isolation Rule.
 */

export interface SpotifyArtistObject {
  id: string;
  name: string;
  uri: string;
  href: string;
}

export interface SpotifyAlbumObject {
  id: string;
  name: string;
  album_type: string;
  release_date?: string;
  images?: Array<{ url: string; height: number; width: number }>;
  uri: string;
}

export interface SpotifyTrackObject {
  id: string;
  name: string;
  duration_ms: number;
  uri: string;
  artists: SpotifyArtistObject[];
  album: SpotifyAlbumObject;
  is_local?: boolean;
}

export interface SpotifyPlayHistoryItem {
  track: SpotifyTrackObject;
  played_at: string;
  context: {
    type: string;
    href: string;
    uri: string;
  } | null;
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyPlayHistoryItem[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  } | null;
  limit: number;
  href: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}
