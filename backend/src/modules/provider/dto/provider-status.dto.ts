import { ConnectionStatus, MusicProvider } from '@prisma/client';

export class ProviderStatusDto {
  id: string;
  provider: MusicProvider;
  providerUserId: string;
  status: ConnectionStatus;
  connectedAt: Date;
  updatedAt: Date;
}
