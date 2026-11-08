import { RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSyncStatus } from './hooks/use-sync-status.hook';
import { SyncIntervalSelector } from './components/sync-interval-selector.component';
import { SyncLogTable } from './components/sync-log-table.component';

export default function SyncPage() {
  const { syncState, recentRuns, triggerSync, isTriggering } = useSyncStatus();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Synchronization Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage synchronization runs and schedule parameters for Spotify playback history.
          </p>
        </div>
        <Button
          onClick={() => triggerSync()}
          disabled={isTriggering}
          className="flex items-center gap-2"
        >
          {isTriggering ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span>{isTriggering ? 'Triggering...' : 'Trigger Sync Now'}</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Engine Status</CardDescription>
            <CardTitle className="text-xl flex items-center justify-between">
              <span>{syncState?.status || 'IDLE'}</span>
              <Badge variant="success">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Worker daemon polling every {syncState?.intervalMinutes || 15} minutes
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Successful Run</CardDescription>
            <CardTitle className="text-xl">
              {syncState?.lastSuccessAt
                ? new Date(syncState.lastSuccessAt).toLocaleTimeString()
                : 'Never'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Synced without errors</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events Archived</CardDescription>
            <CardTitle className="text-xl">
              {syncState?.totalSyncedEvents || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Deduplicated listening history records
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SyncIntervalSelector currentInterval={syncState?.intervalMinutes} />
        <SyncLogTable runs={recentRuns} />
      </div>
    </div>
  );
}
