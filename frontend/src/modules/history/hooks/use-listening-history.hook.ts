import { useQuery } from '@tanstack/react-query';
import { historyApi } from '../api/history.api';
import { ListeningEvent, ListeningHistoryQuery } from '../types/history.type';

export function useListeningHistory(params?: ListeningHistoryQuery) {
  return useQuery<ListeningEvent[]>({
    queryKey: ['listening-history', params],
    queryFn: async () => {
      try {
        const res = await historyApi.getEvents(params);
        return res.data;
      } catch {
        // Fallback for greenfield scaffolding when backend endpoint is not yet connected
        return [];
      }
    },
  });
}
