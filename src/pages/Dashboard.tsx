import { Shield, Scan, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock statistics data
  const stats = {
    totalScans: 156,
    safeUrls: 142,
    suspiciousUrls: 11,
    maliciousUrls: 3,
  };

  const recentActivity = [
    { url: 'https://example.com/safe', status: 'safe', time: '2 min ago' },
    { url: 'https://suspicious-site.xyz', status: 'suspicious', time: '15 min ago' },
    { url: 'https://google.com', status: 'safe', time: '1 hour ago' },
    { url: 'https://phishing-attempt.tk', status: 'malicious', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Scanner</Link>
              <Link to="/dashboard" className="text-sm text-foreground font-medium">Dashboard</Link>
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

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your QR code scanning activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-3xl font-bold">{stats.totalScans}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Scan className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safe URLs</p>
                  <p className="text-3xl font-bold text-primary">{stats.safeUrls}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspicious</p>
                  <p className="text-3xl font-bold text-warning">{stats.suspiciousUrls}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Malicious</p>
                  <p className="text-3xl font-bold text-destructive">{stats.maliciousUrls}</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.status === 'safe' && <CheckCircle className="w-5 h-5 text-primary" />}
                    {item.status === 'suspicious' && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {item.status === 'malicious' && <Shield className="w-5 h-5 text-destructive" />}
                    <span className="font-mono text-sm truncate max-w-md">{item.url}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
