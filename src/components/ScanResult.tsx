import { AnalysisResult, ThreatLevel } from '@/lib/urlAnalyzer';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ScanResultProps {
  result: AnalysisResult;
}

const threatConfig: Record<ThreatLevel, { icon: typeof Shield; color: string; bgColor: string; label: string }> = {
  safe: {
    icon: ShieldCheck,
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Safe',
  },
  suspicious: {
    icon: ShieldAlert,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    label: 'Suspicious',
  },
  malicious: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    label: 'Malicious',
  },
};

export function ScanResult({ result }: ScanResultProps) {
  const [copied, setCopied] = useState(false);
  const config = threatConfig[result.threatLevel];
  const Icon = config.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    if (result.threatLevel === 'safe') {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn('overflow-hidden transition-all duration-300', config.bgColor)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', config.bgColor)}>
              <Icon className={cn('w-6 h-6', config.color)} />
            </div>
            <div>
              <CardTitle className="text-lg">Scan Complete</CardTitle>
              <Badge
                variant="outline"
                className={cn('mt-1', config.color, 'border-current')}
              >
                {config.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Risk Score</div>
            <div className={cn('text-2xl font-bold font-mono', config.color)}>
              {result.riskScore}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Score Progress */}
        <div>
          <Progress
            value={result.riskScore}
            className={cn(
              'h-2',
              result.threatLevel === 'safe' && '[&>div]:bg-success',
              result.threatLevel === 'suspicious' && '[&>div]:bg-warning',
              result.threatLevel === 'malicious' && '[&>div]:bg-destructive'
            )}
          />
        </div>

        {/* URL Display */}
        <div className="bg-background/50 rounded-lg p-3 border border-border">
          <div className="text-xs text-muted-foreground mb-1">Scanned URL</div>
          <div className="font-mono text-sm break-all">{result.url}</div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            {result.threatLevel === 'safe' && (
              <Button variant="outline" size="sm" onClick={handleOpen} className="gap-1">
                <ExternalLink className="w-3 h-3" />
                Open
              </Button>
            )}
          </div>
        </div>

        {/* Threats List */}
        <div>
          <div className="text-sm font-medium mb-2">Analysis Details</div>
          <ul className="space-y-2">
            {result.threats.map((threat, index) => (
              <li
                key={index}
                className={cn(
                  'flex items-start gap-2 text-sm p-2 rounded-lg',
                  result.threatLevel === 'safe' ? 'bg-success/5' : 'bg-destructive/5'
                )}
              >
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                    result.threatLevel === 'safe' ? 'bg-success' : 'bg-destructive'
                  )}
                />
                <span>{threat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-background/50 rounded p-2">
            <span className="text-muted-foreground">Protocol:</span>{' '}
            <span className="font-mono">{result.details.protocol}</span>
          </div>
          <div className="bg-background/50 rounded p-2">
            <span className="text-muted-foreground">Domain:</span>{' '}
            <span className="font-mono truncate">{result.details.domain}</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Scanned at {result.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
