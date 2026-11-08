import { useQuery } from '@tanstack/react-query';
import { Music, CheckCircle2, AlertCircle, Loader2, Moon, Sun } from 'lucide-react';
import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/api-endpoints';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/app/theme-provider';

interface HealthData {
  status: string;
}

export function Header() {
  const { theme, setTheme } = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['backend-health'],
    queryFn: () => apiClient.get<HealthData>(API_ENDPOINTS.HEALTH),
    refetchInterval: 15000,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const isHealthy = !isError && data?.data?.status === 'healthy';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">Music Tracker v0.1</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personal Music Listening Synchronization & Archival
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Backend:</span>
            {isLoading ? (
              <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                <span>Checking...</span>
              </Badge>
            ) : isHealthy ? (
              <Badge variant="success" className="flex items-center gap-1.5 text-xs font-normal">
                <CheckCircle2 className="h-3 w-3" />
                <span>Healthy</span>
              </Badge>
            ) : (
              <Badge variant="danger" className="flex items-center gap-1.5 text-xs font-normal">
                <AlertCircle className="h-3 w-3" />
                <span>Offline</span>
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-foreground transition-all" />
            ) : (
              <Moon className="h-4 w-4 text-foreground transition-all" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
