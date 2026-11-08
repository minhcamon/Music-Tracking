import { Radio, RefreshCw, History, ArrowRight, Layers, ShieldCheck, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Music Tracker v0.1</h2>
        <p className="text-muted-foreground mt-1 text-base">
          Personal Music Listening Synchronization & Archival Hub
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Module 1: Connection */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Radio className="h-5 w-5" />
              </div>
              <Badge variant="secondary">Ready for OAuth</Badge>
            </div>
            <CardTitle>Spotify Connection</CardTitle>
            <CardDescription>
              PKCE OAuth2 authentication with AES-256-GCM token encryption at rest
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Scopes: user-read-recently-played</p>
            <p>• Isolated in src/integrations/spotify</p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/connection">
                <span>Manage Connection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Module 2: Sync Engine */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <RefreshCw className="h-5 w-5" />
              </div>
              <Badge variant="outline">Interval: 15m</Badge>
            </div>
            <CardTitle>Sync Engine</CardTitle>
            <CardDescription>
              Periodic scheduler pulling cursor-based playback history
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Status: IDLE / Ready</p>
            <p>• Ingestion deduplication by playedAt</p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/sync">
                <span>View Engine</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Module 3: History */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <History className="h-5 w-5" />
              </div>
              <Badge variant="outline">0 Archived</Badge>
            </div>
            <CardTitle>Listening Events</CardTitle>
            <CardDescription>
              Canonical ListeningEvent storage respecting the Honest Data Rule
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Nullable duration fields preserved</p>
            <p>• Multi-artist & album associations</p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to="/history">
                <span>View History</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Architecture Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Scaffold Architecture Highlights
          </CardTitle>
          <CardDescription>
            Core design contracts implemented under Version 0 (PLAN-00)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
          <div className="rounded-lg border p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Standard Envelope</span>
            </div>
            <p className="text-muted-foreground">
              All API requests strictly adhere to the standardized <code className="font-mono text-foreground">&#123; code, message, data &#125;</code> envelope.
            </p>
          </div>
          <div className="rounded-lg border p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Vite Proxy</span>
            </div>
            <p className="text-muted-foreground">
              Frontend dev server forwards <code className="font-mono text-foreground">/api/*</code> to NestJS on port 3000, eliminating CORS friction in development.
            </p>
          </div>
          <div className="rounded-lg border p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Layers className="h-4 w-4 text-purple-500" />
              <span>TanStack Query v5</span>
            </div>
            <p className="text-muted-foreground">
              Server state management isolated with TanStack Query v5; zero unapproved external state libraries.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
