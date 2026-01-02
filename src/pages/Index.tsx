import { useState, useCallback } from 'react';
import { Shield, Scan, BarChart3 } from 'lucide-react';
import { QRScanner } from '@/components/QRScanner';
import { ScanResult } from '@/components/ScanResult';
import { ScanHistory } from '@/components/ScanHistory';
import { ManualInput } from '@/components/ManualInput';
import { analyzeUrl, AnalysisResult } from '@/lib/urlAnalyzer';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-foreground font-medium">Scanner</Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground">History</Link>
            </div>
            <Link to="/auth">
              <button className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Scan QR Codes Safely</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Advanced AI-powered security scanner that detects malicious URLs, phishing attempts, and security threats in QR codes
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Scan className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Real-time Scanning</h3>
                <p className="text-sm text-muted-foreground">
                  Upload images or use camera to scan QR codes instantly
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms detect malicious URLs and threats
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track scan history and security metrics over time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center">QR Code Scanner</CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Upload or scan QR codes for security analysis
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>

          {/* History */}
          <div className="mt-6">
            <ScanHistory
              history={history}
              onSelect={handleSelectFromHistory}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Explore More Features</h2>
          <p className="text-muted-foreground">
            SecureQR: AI-Powered Security
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
