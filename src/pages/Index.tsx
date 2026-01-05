import { useState, useCallback } from 'react';
import { Shield, Scan, BarChart3, Github, Twitter, Mail, Heart, AlertTriangle, CheckCircle, TrendingUp, Clock, Activity, Trash2, Search, Filter } from 'lucide-react';
import { QRScanner } from '@/components/QRScanner';
import { ScanResult } from '@/components/ScanResult';
import { ScanHistory } from '@/components/ScanHistory';
import { ManualInput } from '@/components/ManualInput';
import { analyzeUrl, AnalysisResult } from '@/lib/urlAnalyzer';
import { useToast } from '@/hooks/use-toast';
import { useScanHistory } from '@/context/ScanHistoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const Index = () => {
  const [scannerActive, setScannerActive] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const { history, addToHistory, clearHistory } = useScanHistory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleScan = useCallback((data: string) => {
    const result = analyzeUrl(data);
    setCurrentResult(result);
    addToHistory(result);

    toast({
      title: result.threatLevel === 'safe' ? 'Safe URL Detected' : 
             result.threatLevel === 'suspicious' ? 'Suspicious URL Detected' : 
             'Malicious URL Detected!',
      description: `Risk Score: ${result.riskScore}%`,
      variant: result.threatLevel === 'safe' ? 'default' : 'destructive',
    });
  }, [toast, addToHistory]);

  const handleAnalyze = (url: string) => {
    const result = analyzeUrl(url);
    setCurrentResult(result);
    addToHistory(result);
  };

  const handleSelectFromHistory = (result: AnalysisResult) => {
    setCurrentResult(result);
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: 'History Cleared',
      description: 'Scan history has been cleared',
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dashboard mock data
  const stats = {
    totalScans: history.length || 156,
    safeUrls: history.filter(h => h.threatLevel === 'safe').length || 142,
    suspiciousUrls: history.filter(h => h.threatLevel === 'suspicious').length || 11,
    maliciousUrls: history.filter(h => h.threatLevel === 'malicious').length || 3,
  };

  const riskDistributionData = [
    { name: 'Safe', value: stats.safeUrls, color: 'hsl(142, 76%, 36%)' },
    { name: 'Suspicious', value: stats.suspiciousUrls, color: 'hsl(45, 93%, 47%)' },
    { name: 'Malicious', value: stats.maliciousUrls, color: 'hsl(0, 84%, 60%)' },
  ];

  const threatOverviewData = [
    { date: 'Mon', safe: 20, suspicious: 2, malicious: 0 },
    { date: 'Tue', safe: 25, suspicious: 1, malicious: 1 },
    { date: 'Wed', safe: 18, suspicious: 3, malicious: 0 },
    { date: 'Thu', safe: 22, suspicious: 2, malicious: 1 },
    { date: 'Fri', safe: 30, suspicious: 1, malicious: 0 },
    { date: 'Sat', safe: 15, suspicious: 1, malicious: 1 },
    { date: 'Sun', safe: 12, suspicious: 1, malicious: 0 },
  ];

  const threatTimelineData = [
    { time: '00:00', threats: 0 },
    { time: '04:00', threats: 1 },
    { time: '08:00', threats: 3 },
    { time: '12:00', threats: 2 },
    { time: '16:00', threats: 4 },
    { time: '20:00', threats: 1 },
    { time: '24:00', threats: 0 },
  ];

  const recentActivity = [
    { url: 'https://example.com/safe', status: 'safe', time: '2 min ago' },
    { url: 'https://suspicious-site.xyz', status: 'suspicious', time: '15 min ago' },
    { url: 'https://google.com', status: 'safe', time: '1 hour ago' },
    { url: 'https://phishing-attempt.tk', status: 'malicious', time: '2 hours ago' },
  ];

  // History helpers
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => scrollToSection('scanner')} className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-white">SecureQR</span>
            </button>
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
              <button onClick={() => scrollToSection('scanner')} className="text-sm text-white font-medium hover:text-white transition-colors">Scanner</button>
              <button onClick={() => scrollToSection('dashboard')} className="text-sm text-muted-foreground hover:text-white transition-colors">Dashboard</button>
              <button onClick={() => scrollToSection('history')} className="text-sm text-muted-foreground hover:text-white transition-colors">History</button>
            </nav>
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white hover:text-background">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Scanner Section */}
      <section id="scanner" className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Scan QR Codes Safely</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced AI-powered security scanner that detects malicious URLs, phishing attempts, and security threats in QR codes
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Scan className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Real-time Scanning</h3>
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
                <h3 className="font-semibold mb-2 text-foreground">AI-Powered Detection</h3>
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
                <h3 className="font-semibold mb-2 text-foreground">Detailed Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track scan history and security metrics over time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scanner Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-center text-foreground">QR Code Scanner</CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Upload or scan QR codes for security analysis
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <QRScanner
                  onScan={handleScan}
                  isActive={scannerActive}
                  onToggle={() => setScannerActive(!scannerActive)}
                />

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Or enter a URL manually:
                  </p>
                  <ManualInput onAnalyze={handleAnalyze} />
                </div>

                {currentResult && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <ScanResult result={currentResult} />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6">
              <ScanHistory
                history={history}
                onSelect={handleSelectFromHistory}
                onClear={handleClearHistory}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-foreground">Dashboard</h2>
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Threat Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={threatOverviewData}>
                      <defs>
                        <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
                      <XAxis dataKey="date" stroke="hsl(240, 5%, 64.9%)" fontSize={12} />
                      <YAxis stroke="hsl(240, 5%, 64.9%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(240, 10%, 3.9%)', 
                          border: '1px solid hsl(240, 3.7%, 15.9%)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area type="monotone" dataKey="safe" stackId="1" stroke="hsl(142, 76%, 36%)" fill="url(#colorSafe)" name="Safe" />
                      <Area type="monotone" dataKey="suspicious" stackId="1" stroke="hsl(45, 93%, 47%)" fill="url(#colorSuspicious)" name="Suspicious" />
                      <Area type="monotone" dataKey="malicious" stackId="1" stroke="hsl(0, 84%, 60%)" fill="url(#colorMalicious)" name="Malicious" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(240, 10%, 10%)', 
                          border: '1px solid hsl(240, 3.7%, 25%)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        itemStyle={{ color: 'white' }}
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threat Detection Timeline */}
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Threat Detection Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={threatTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
                    <XAxis dataKey="time" stroke="hsl(240, 5%, 64.9%)" fontSize={12} />
                    <YAxis stroke="hsl(240, 5%, 64.9%)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(240, 10%, 3.9%)', 
                        border: '1px solid hsl(240, 3.7%, 15.9%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="threats" 
                      stroke="hsl(0, 84%, 60%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: 'hsl(0, 84%, 60%)' }}
                      name="Threats Detected"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Scan History</h2>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg text-foreground">SecureQR</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered QR code security scanner protecting you from malicious links and phishing attempts.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => scrollToSection('scanner')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Scanner</button>
                <button onClick={() => scrollToSection('dashboard')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Dashboard</button>
                <button onClick={() => scrollToSection('history')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">History</button>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <Github className="w-5 h-5 text-foreground" />
                </a>
                <a href="#" className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <Twitter className="w-5 h-5 text-foreground" />
                </a>
                <a href="#" className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <Mail className="w-5 h-5 text-foreground" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Questions? Contact us anytime.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SecureQR. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for secure browsing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
