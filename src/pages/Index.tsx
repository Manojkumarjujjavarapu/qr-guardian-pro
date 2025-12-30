import { useState, useCallback } from 'react';
import { Shield, Scan, Info } from 'lucide-react';
import { QRScanner } from '@/components/QRScanner';
import { ScanResult } from '@/components/ScanResult';
import { ScanHistory } from '@/components/ScanHistory';
import { ManualInput } from '@/components/ManualInput';
import { analyzeUrl, AnalysisResult } from '@/lib/urlAnalyzer';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [scannerActive, setScannerActive] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  const handleScan = useCallback((data: string) => {
    const result = analyzeUrl(data);
    setCurrentResult(result);
    setHistory((prev) => [result, ...prev.slice(0, 49)]);

    toast({
      title: result.threatLevel === 'safe' ? 'Safe URL Detected' : 
             result.threatLevel === 'suspicious' ? 'Suspicious URL Detected' : 
             'Malicious URL Detected!',
      description: `Risk Score: ${result.riskScore}%`,
      variant: result.threatLevel === 'safe' ? 'default' : 'destructive',
    });
  }, [toast]);

  const handleAnalyze = (url: string) => {
    const result = analyzeUrl(url);
    setCurrentResult(result);
    setHistory((prev) => [result, ...prev.slice(0, 49)]);
  };

  const handleSelectFromHistory = (result: AnalysisResult) => {
    setCurrentResult(result);
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: 'History Cleared',
      description: 'Scan history has been cleared',
    });
  };

  return (
    <div className="min-h-screen bg-background grid-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">QR Shield</h1>
              <p className="text-xs text-muted-foreground">Malicious QR Code Detection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan" className="gap-2">
              <Scan className="w-4 h-4" />
              Scan QR
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <Info className="w-4 h-4" />
              How it Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            {/* QR Scanner */}
            <QRScanner
              onScan={handleScan}
              isActive={scannerActive}
              onToggle={() => setScannerActive(!scannerActive)}
            />

            {/* Manual URL Input */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Or enter a URL manually:
              </p>
              <ManualInput onAnalyze={handleAnalyze} />
            </div>

            {/* Current Result */}
            {currentResult && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ScanResult result={currentResult} />
              </div>
            )}

            {/* History */}
            <ScanHistory
              history={history}
              onSelect={handleSelectFromHistory}
              onClear={handleClearHistory}
            />
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-lg font-semibold">How QR Shield Works</h2>
                <p className="text-sm text-muted-foreground">
                  QR Shield analyzes URLs from QR codes using multiple detection techniques 
                  to identify potential threats before you click.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">URL Structure Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Checks for IP addresses, suspicious TLDs, excessive subdomains, and non-standard ports.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Phishing Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        Scans for common phishing keywords and homograph attacks using look-alike characters.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Malware Indicators</h3>
                      <p className="text-sm text-muted-foreground">
                        Detects suspicious file extensions, URL shorteners, and redirect chains.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Risk Scoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Combines all factors into a risk score: Safe (0-19%), Suspicious (20-49%), Malicious (50-100%).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> While QR Shield provides robust analysis, no tool can guarantee 
                    100% detection. Always exercise caution with unfamiliar URLs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            QR Shield • Real-time Malicious QR Detection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
