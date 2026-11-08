import { History, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ListeningEventList } from './components/listening-event-list.component';
import { useListeningHistory } from './hooks/use-listening-history.hook';

export default function HistoryPage() {
  const { data: events = [] } = useListeningHistory();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <span>Listening History</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Historical record of music tracks played across integrated providers.
        </p>
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4 text-xs text-amber-700 dark:text-amber-400">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Honest Data Rule Enforced:</span>
            <p className="mt-0.5 leading-relaxed">
              Spotify&#39;s API does not return actual listened duration or completion rate in recently played events.
              The application intentionally leaves listened durations as NULL instead of inferring them from track duration.
            </p>
          </div>
        </CardContent>
      </Card>

      <ListeningEventList events={events} />
    </div>
  );
}
