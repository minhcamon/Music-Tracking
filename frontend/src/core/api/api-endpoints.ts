export const API_ENDPOINTS = {
  HEALTH: '/health',
  PROVIDER: {
    SPOTIFY_LOGIN: '/provider/spotify/login',
    SPOTIFY_CALLBACK: '/provider/spotify/callback',
    SPOTIFY_STATUS: '/provider/spotify/status',
    SPOTIFY_DISCONNECT: '/provider/spotify/disconnect',
  },
  SYNC: {
    STATUS: '/sync/status',
    TRIGGER: '/sync/trigger',
    SETTINGS: '/sync/settings',
    RUNS: '/sync/runs',
  },
  LISTENING: {
    EVENTS: '/listening-events',
  },
} as const;
