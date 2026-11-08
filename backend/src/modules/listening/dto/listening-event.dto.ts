import { MusicProvider } from '@prisma/client';

export class ListeningEventDto {
  id!: string;
  userId!: string;
  provider!: MusicProvider;
  providerTrackId!: string;
  trackName!: string;
  artistNames!: string[];
  albumName!: string | null;
  trackDurationMs!: number | null;
  playedAt!: Date;

  // Honest Data Rule: playback duration inference fields are strictly null
  startedAt!: Date | null;
  endedAt!: Date | null;
  listenedDurationMs!: number | null;
  startProgressMs!: number | null;
  endProgressMs!: number | null;
  completionRate!: number | null;
}
