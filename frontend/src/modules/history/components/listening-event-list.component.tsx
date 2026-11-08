import { Disc3, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ListeningEvent } from '../types/history.type';

interface Props {
  events: ListeningEvent[];
}

export function ListeningEventList({ events }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Playback History Feed</CardTitle>
          </div>
          <Badge variant="outline">{events.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No playback events recorded yet. Connect your Spotify account to synchronize listening history.
          </div>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-muted-foreground">
                    <Disc3 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {event.track?.title || 'Unknown Track'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.track?.artists?.map((a) => a.name).join(', ') || 'Unknown Artist'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {event.listenedDurationMs !== null
                        ? `${Math.round(event.listenedDurationMs / 1000)}s`
                        : 'Duration: N/A'}
                    </span>
                  </div>
                  <Badge variant="secondary">{event.source}</Badge>
                  <span className="font-mono">{new Date(event.playedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
