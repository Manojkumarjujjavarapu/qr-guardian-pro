import { Shield, Scan, AlertTriangle, CheckCircle, TrendingUp, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const Dashboard = () => {
  // Mock statistics data
  const stats = {
    totalScans: 156,
    safeUrls: 142,
    suspiciousUrls: 11,
    maliciousUrls: 3,
  };

  // Risk distribution data for pie chart
  const riskDistributionData = [
    { name: 'Safe', value: 142, color: 'hsl(142, 76%, 36%)' },
    { name: 'Suspicious', value: 11, color: 'hsl(45, 93%, 47%)' },
    { name: 'Malicious', value: 3, color: 'hsl(0, 84%, 60%)' },
  ];

  // Threat overview data for area chart
  const threatOverviewData = [
    { date: 'Mon', safe: 20, suspicious: 2, malicious: 0 },
    { date: 'Tue', safe: 25, suspicious: 1, malicious: 1 },
    { date: 'Wed', safe: 18, suspicious: 3, malicious: 0 },
    { date: 'Thu', safe: 22, suspicious: 2, malicious: 1 },
    { date: 'Fri', safe: 30, suspicious: 1, malicious: 0 },
    { date: 'Sat', safe: 15, suspicious: 1, malicious: 1 },
    { date: 'Sun', safe: 12, suspicious: 1, malicious: 0 },
  ];

  // Threat detection timeline data
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
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Dashboard</h1>
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
          {/* Threat Overview Chart */}
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

          {/* Risk Distribution Pie Chart */}
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
                        backgroundColor: 'hsl(240, 10%, 3.9%)', 
                        border: '1px solid hsl(240, 3.7%, 15.9%)',
                        borderRadius: '8px'
                      }} 
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
      </main>
    </div>
  );
};

export default Dashboard;
