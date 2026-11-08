import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/api-endpoints';
import { ProviderConnectionStatus } from '../types/connection.type';

export const connectionApi = {
  getSpotifyStatus: async () => {
    return apiClient.get<ProviderConnectionStatus>(API_ENDPOINTS.PROVIDER.SPOTIFY_STATUS);
  },
  disconnectSpotify: async () => {
    return apiClient.post<{ success: boolean }>(API_ENDPOINTS.PROVIDER.SPOTIFY_DISCONNECT);
  },
  getSpotifyLoginUrl: () => {
    return `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}${API_ENDPOINTS.PROVIDER.SPOTIFY_LOGIN}`;
  },
};
