import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface Props {
  currentInterval?: number;
}

const intervals = [5, 15, 30, 60];

export function SyncIntervalSelector({ currentInterval = 15 }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Sync Schedule Interval</CardTitle>
        </div>
        <CardDescription>
          Configure how frequently the synchronization worker polls for newly played tracks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {intervals.map((mins) => (
            <Button
              key={mins}
              variant={mins === currentInterval ? 'default' : 'outline'}
              size="sm"
            >
              Every {mins} min
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended interval: 15 minutes. Complies with Spotify API rate limits and prevents quota exhaustion.
        </p>
      </CardContent>
    </Card>
  );
}
