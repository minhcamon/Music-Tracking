import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SyncRunItem } from '../types/sync.type';
import { ListFilter } from 'lucide-react';

interface Props {
  runs: SyncRunItem[];
}

export function SyncLogTable({ runs }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Recent Sync Executions</CardTitle>
          </div>
          <Badge variant="outline">{runs.length} runs recorded</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No synchronization runs recorded yet. Trigger a sync or wait for the scheduler.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-2">Time</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Fetched</th>
                  <th className="py-2">Inserted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {runs.map((run) => (
                  <tr key={run.id}>
                    <td className="py-2 font-mono text-xs">{new Date(run.startedAt).toLocaleString()}</td>
                    <td className="py-2">
                      <Badge variant={run.status === 'SUCCESS' ? 'success' : 'danger'}>
                        {run.status}
                      </Badge>
                    </td>
                    <td className="py-2">{run.itemsFetched}</td>
                    <td className="py-2">{run.itemsInserted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
