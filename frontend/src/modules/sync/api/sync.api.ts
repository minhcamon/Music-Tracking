import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/api-endpoints';
import { SyncState, SyncRunItem } from '../types/sync.type';

export const syncApi = {
  getStatus: async () => {
    return apiClient.get<SyncState>(API_ENDPOINTS.SYNC.STATUS);
  },
  triggerManualSync: async () => {
    return apiClient.post<{ message: string; runId: string }>(API_ENDPOINTS.SYNC.TRIGGER);
  },
  updateInterval: async (intervalMinutes: number) => {
    return apiClient.put<{ intervalMinutes: number }>(API_ENDPOINTS.SYNC.SETTINGS, {
      intervalMinutes,
    });
  },
  getRecentRuns: async () => {
    return apiClient.get<SyncRunItem[]>(API_ENDPOINTS.SYNC.RUNS);
  },
};
