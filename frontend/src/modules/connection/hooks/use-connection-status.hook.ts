import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectionApi } from '../api/connection.api';

export function useConnectionStatus() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['provider-status', 'spotify'],
    queryFn: async () => {
      try {
        const res = await connectionApi.getSpotifyStatus();
        return res.data;
      } catch {
        // Fallback for greenfield scaffolding when backend endpoint is not yet connected
        return {
          provider: 'SPOTIFY' as const,
          status: 'DISCONNECTED' as const,
        };
      }
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => connectionApi.disconnectSpotify(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-status'] });
    },
  });

  return {
    ...query,
    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
  };
}
