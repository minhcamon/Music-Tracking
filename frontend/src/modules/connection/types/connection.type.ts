export interface ProviderConnectionStatus {
  provider: 'SPOTIFY' | 'APPLE_MUSIC' | 'YOUTUBE_MUSIC';
  status: 'CONNECTED' | 'REAUTH_REQUIRED' | 'DISCONNECTED';
  accountUsername?: string;
  connectedAt?: string;
  scopes?: string[];
}
