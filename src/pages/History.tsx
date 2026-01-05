import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useScanHistory } from '@/context/ScanHistoryContext';
import { useToast } from '@/hooks/use-toast';

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { history, clearHistory } = useScanHistory();
  const { toast } = useToast();

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.threatLevel === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'malicious':
        return <Shield className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, riskScore: number) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case 'safe':
        return <span className={`${baseClasses} bg-primary/10 text-primary`}>{riskScore}% Risk</span>;
      case 'suspicious':
        return <span className={`${baseClasses} bg-warning/10 text-warning`}>{riskScore}% Risk</span>;
      case 'malicious':
        return <span className={`${baseClasses} bg-destructive/10 text-destructive`}>{riskScore}% Risk</span>;
      default:
        return null;
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: 'History Cleared',
      description: 'All scan history has been cleared',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-white">SecureQR</span>
            </Link>
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
              <Link to="/" className="text-sm text-muted-foreground hover:text-white transition-colors">Scanner</Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
              <Link to="/history" className="text-sm text-white font-medium">History</Link>
            </nav>
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white hover:text-background">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Scan History</h1>
          <p className="text-muted-foreground">View and manage your past QR code scans</p>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search URLs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'safe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('safe')}
                >
                  Safe
                </Button>
                <Button
                  variant={filterStatus === 'suspicious' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('suspicious')}
                >
                  Suspicious
                </Button>
                <Button
                  variant={filterStatus === 'malicious' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('malicious')}
                >
                  Malicious
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Scanned URLs</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={handleClearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {history.length === 0 ? 'No scans yet. Scan a QR code to see results here.' : 'No results found'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(item.threatLevel)}
                      <div>
                        <p className="font-mono text-sm truncate max-w-md text-foreground">{item.url}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.threatLevel, item.riskScore)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
