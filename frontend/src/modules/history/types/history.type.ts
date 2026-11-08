/**
 * Represents a synchronized listening event record.
 * HONEST DATA RULE COMPLIANCE:
 * startedAt, endedAt, listenedDurationMs, startProgressMs, endProgressMs, completionRate
 * MUST remain nullable. Never synthesize or infer listened durations from trackDurationMs.
 */
export interface ListeningEvent {
  id: string;
  userId: string;
  trackId: string;
  playedAt: string;
  source: 'SPOTIFY' | 'APPLE_MUSIC' | 'YOUTUBE_MUSIC' | 'LOCAL_FILE';
  
  // Honest Data Rule: Strictly nullable fields
  startedAt: string | null;
  endedAt: string | null;
  listenedDurationMs: number | null;
  startProgressMs: number | null;
  endProgressMs: number | null;
  completionRate: number | null;

  track?: {
    id: string;
    title: string;
    durationMs: number;
    artists: Array<{
      name: string;
      role?: string;
    }>;
    album?: {
      title: string;
      coverImageUrl?: string | null;
    };
  };
}

export interface ListeningHistoryQuery {
  page?: number;
  limit?: number;
  source?: string;
  [key: string]: unknown;
}
