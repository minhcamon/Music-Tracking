import { ConnectionCard } from './components/connection-card.component';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldCheck, KeyRound, Lock } from 'lucide-react';

export default function ConnectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Provider Connections</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage integrations with music streaming providers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionCard />

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Security & Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <KeyRound className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <span>
                <strong>Token Encryption:</strong> Access and Refresh tokens are encrypted with AES-256-GCM
                before database persistence.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <span>
                <strong>Spotify Policy Gate:</strong> Scopes are strictly limited to
                `user-read-recently-played` and `user-read-currently-playing`.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
