import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/api-endpoints';
import { ListeningEvent, ListeningHistoryQuery } from '../types/history.type';

export const historyApi = {
  getEvents: async (query?: ListeningHistoryQuery) => {
    return apiClient.get<ListeningEvent[]>(API_ENDPOINTS.LISTENING.EVENTS, {
      params: query,
    });
  },
};
