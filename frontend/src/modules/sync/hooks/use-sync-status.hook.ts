import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { syncApi } from '../api/sync.api';
import { SyncState, SyncRunItem } from '../types/sync.type';

export function useSyncStatus() {
  const queryClient = useQueryClient();

  const statusQuery = useQuery<SyncState>({
    queryKey: ['sync-status'],
    queryFn: async () => {
      try {
        const res = await syncApi.getStatus();
        return res.data;
      } catch {
        // Fallback for greenfield scaffolding
        return {
          status: 'IDLE',
          lastSyncAt: null,
          lastSuccessAt: null,
          intervalMinutes: 15,
          totalSyncedEvents: 0,
        };
      }
    },
    refetchInterval: 30000,
  });

  const runsQuery = useQuery<SyncRunItem[]>({
    queryKey: ['sync-runs'],
    queryFn: async () => {
      try {
        const res = await syncApi.getRecentRuns();
        return res.data;
      } catch {
        return [];
      }
    },
  });

  const triggerMutation = useMutation({
    mutationFn: () => syncApi.triggerManualSync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
      queryClient.invalidateQueries({ queryKey: ['sync-runs'] });
    },
  });

  return {
    syncState: statusQuery.data,
    isLoading: statusQuery.isLoading,
    recentRuns: runsQuery.data || [],
    triggerSync: triggerMutation.mutate,
    isTriggering: triggerMutation.isPending,
  };
}
