import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface HistoryItem {
  id: number;
  url: string;
  status: 'safe' | 'suspicious' | 'malicious';
  riskScore: number;
  timestamp: string;
}

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock history data
  const [historyData] = useState<HistoryItem[]>([
    { id: 1, url: 'https://google.com', status: 'safe', riskScore: 5, timestamp: '2024-01-15 10:30 AM' },
    { id: 2, url: 'https://suspicious-link.xyz/login', status: 'suspicious', riskScore: 45, timestamp: '2024-01-15 09:15 AM' },
    { id: 3, url: 'https://github.com', status: 'safe', riskScore: 2, timestamp: '2024-01-14 04:20 PM' },
    { id: 4, url: 'https://phishing-site.tk/bank', status: 'malicious', riskScore: 85, timestamp: '2024-01-14 02:00 PM' },
    { id: 5, url: 'https://example.com', status: 'safe', riskScore: 8, timestamp: '2024-01-14 11:30 AM' },
    { id: 6, url: 'https://free-prize.win', status: 'malicious', riskScore: 92, timestamp: '2024-01-13 03:45 PM' },
  ]);

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Scanner</Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link to="/history" className="text-sm text-foreground font-medium">History</Link>
            </div>
            <Link to="/auth">
              <button className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scan History</h1>
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
              <CardTitle>Scanned URLs</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No results found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-mono text-sm truncate max-w-md">{item.url}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status, item.riskScore)}
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
