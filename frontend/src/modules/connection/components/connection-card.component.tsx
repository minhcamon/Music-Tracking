import { Radio, ExternalLink, Unlink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConnectionStatus } from '../hooks/use-connection-status.hook';
import { connectionApi } from '../api/connection.api';

export function ConnectionCard() {
  const { data, isLoading, disconnect, isDisconnecting } = useConnectionStatus();

  const isConnected = data?.status === 'CONNECTED';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-emerald-500" />
            <CardTitle>Spotify Connection</CardTitle>
          </div>
          <CardDescription>
            Connect Spotify via OAuth2 Authorization Code flow with PKCE
          </CardDescription>
        </div>
        {isLoading ? (
          <Badge variant="outline">Loading...</Badge>
        ) : isConnected ? (
          <Badge variant="success">Connected</Badge>
        ) : (
          <Badge variant="secondary">Ready for OAuth</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Authorizes access to read currently playing track and recently played listening history.
          Tokens are encrypted with AES-256-GCM at rest.
        </p>
        {data?.accountUsername && (
          <p className="font-mono text-xs text-foreground">
            Account: <span className="font-semibold">{data.accountUsername}</span>
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-3 pt-2">
        {isConnected ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => disconnect()}
            disabled={isDisconnecting}
            className="flex items-center gap-2"
          >
            <Unlink className="h-4 w-4" />
            <span>{isDisconnecting ? 'Disconnecting...' : 'Disconnect'}</span>
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              window.location.href = connectionApi.getSpotifyLoginUrl();
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Connect Spotify</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
