export interface SyncState {
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'RATE_LIMITED' | 'PARTIAL_SUCCESS';
  lastSyncAt: string | null;
  lastSuccessAt: string | null;
  intervalMinutes: number;
  totalSyncedEvents: number;
}

export interface SyncRunItem {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: string;
  itemsFetched: number;
  itemsInserted: number;
  errorMessage?: string | null;
}
