import { AnalysisResult, ThreatLevel } from '@/lib/urlAnalyzer';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Trash2, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ScanHistoryProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
}

const threatIcons: Record<ThreatLevel, typeof Shield> = {
  safe: ShieldCheck,
  suspicious: ShieldAlert,
  malicious: AlertTriangle,
};

const threatColors: Record<ThreatLevel, string> = {
  safe: 'text-success',
  suspicious: 'text-warning',
  malicious: 'text-destructive',
};

export function ScanHistory({ history, onSelect, onClear }: ScanHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="bg-card/50">
        <CardContent className="py-8 text-center">
          <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No scan history yet</p>
          <p className="text-muted-foreground text-xs mt-1">
            Scanned QR codes will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4" />
            Scan History
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 pt-0 space-y-2">
            {history.map((result, index) => {
              const Icon = threatIcons[result.threatLevel];
              return (
                <button
                  key={index}
                  onClick={() => onSelect(result)}
                  className={cn(
                    'w-full p-3 rounded-lg border border-border bg-background/50',
                    'hover:bg-accent/50 transition-colors text-left',
                    'flex items-center gap-3'
                  )}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', threatColors[result.threatLevel])} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs truncate">{result.url}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded',
                      result.threatLevel === 'safe' && 'bg-success/10 text-success',
                      result.threatLevel === 'suspicious' && 'bg-warning/10 text-warning',
                      result.threatLevel === 'malicious' && 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {result.riskScore}%
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
