
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatCard from './StatCard';
import ActivityLog from './ActivityLog';
import { Car, Users, Clock, AlertTriangle, Calendar, Timer, ShieldCheck } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for daily traffic
const dailyTrafficData = [
  { hour: '00:00', entries: 2, exits: 1 },
  { hour: '03:00', entries: 1, exits: 2 },
  { hour: '06:00', entries: 5, exits: 3 },
  { hour: '09:00', entries: 28, exits: 12 },
  { hour: '12:00', entries: 14, exits: 18 },
  { hour: '15:00', entries: 12, exits: 17 },
  { hour: '18:00', entries: 5, exits: 22 },
  { hour: '21:00', entries: 3, exits: 4 },
];

// Mock data for weekly traffic
const weeklyTrafficData = [
  { day: 'Mon', entries: 24, exits: 20 },
  { day: 'Tue', entries: 18, exits: 16 },
  { day: 'Wed', entries: 26, exits: 22 },
  { day: 'Thu', entries: 30, exits: 28 },
  { day: 'Fri', entries: 36, exits: 32 },
  { day: 'Sat', entries: 15, exits: 14 },
  { day: 'Sun', entries: 8, exits: 7 },
];

// Mock data for monthly traffic
const monthlyTrafficData = [
  { date: 'Jun 1', entries: 42, exits: 38 },
  { date: 'Jun 5', entries: 48, exits: 44 },
  { date: 'Jun 10', entries: 56, exits: 50 },
  { date: 'Jun 15', entries: 61, exits: 58 },
  { date: 'Jun 20', entries: 58, exits: 54 },
  { date: 'Jun 25', entries: 52, exits: 48 },
  { date: 'Jun 30', entries: 45, exits: 40 },
];

// Use existing mock data for other charts
const vehicleTypeData = [
  { name: 'Cars', value: 65 },
  { name: 'Motorcycles', value: 20 },
  { name: 'Vans', value: 10 },
  { name: 'Trucks', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const visitorTrendData = [
  { date: '06/01', visitors: 12 },
  { date: '06/02', visitors: 15 },
  { date: '06/03', visitors: 8 },
  { date: '06/04', visitors: 10 },
  { date: '06/05', visitors: 18 },
  { date: '06/06', visitors: 22 },
  { date: '06/07', visitors: 14 },
];

// Mock alert data
const alertsData = [
  { id: 1, type: 'unauthorized', message: 'Unauthorized vehicle attempted entry', time: '15 min ago' },
  { id: 2, type: 'system', message: 'RFID scanner needs maintenance', time: '1 hr ago' },
  { id: 3, type: 'unauthorized', message: 'Invalid exit attempt detected', time: '2 hrs ago' },
];

const DashboardView = () => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Function to get the appropriate traffic data based on the selected timeframe
  const getTrafficData = () => {
    switch (selectedTimeframe) {
      case 'day':
        return dailyTrafficData;
      case 'month':
        return monthlyTrafficData;
      case 'week':
      default:
        return weeklyTrafficData;
    }
  };

  // Function to get the appropriate x-axis key based on the selected timeframe
  const getXAxisKey = () => {
    switch (selectedTimeframe) {
      case 'day':
        return 'hour';
      case 'month':
        return 'date';
      case 'week':
      default:
        return 'day';
    }
  };

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    toast({
      title: `Showing ${value}ly traffic data`,
      description: `Displaying gate traffic analysis for the past ${value}.`,
    });
  };

  const handleAlertDismiss = (id: number) => {
    toast({
      title: "Alert dismissed",
      description: "The alert has been acknowledged and dismissed.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Registered Vehicles"
          value="356"
          icon={Car}
          trend={{ value: 12, isPositive: true }}
          colorScheme="primary"
          className="animate-fade-in"
          description="Total active registrations"
        />
        <StatCard 
          title="Daily Visitors"
          value="28"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          colorScheme="secondary"
          className="animate-fade-in"
          description="Average per day"
          
        />
        <StatCard 
          title="Avg. Response Time"
          value="3.2s"
          icon={Clock}
          trend={{ value: 0.5, isPositive: true }}
          className="animate-fade-in"
          description="Gate response time"
        />
        <StatCard 
          title="Security Alerts"
          value="2"
          icon={AlertTriangle}
          colorScheme="destructive"
          className="animate-fade-in"
          description="Unresolved issues"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Gate Traffic Analysis</CardTitle>
              <CardDescription>Entry and exit patterns over time</CardDescription>
            </div>
            <Tabs 
              defaultValue="week" 
              className="w-[240px]" 
              value={selectedTimeframe}
              onValueChange={handleTimeframeChange}
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px] mt-4 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getTrafficData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey={getXAxisKey()} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Legend iconType="circle" />
                  <Bar 
                    name="Entries" 
                    dataKey="entries" 
                    fill="#0088FE" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20} 
                    animationDuration={1000} 
                  />
                  <Bar 
                    name="Exits" 
                    dataKey="exits" 
                    fill="#00C49F" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20} 
                    animationDuration={1500} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-7 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Latest Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className="bg-background p-3 rounded-lg border flex flex-col gap-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <Badge variant={alert.type === 'unauthorized' ? 'destructive' : 'secondary'}>
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="self-end text-xs h-8"
                    onClick={() => handleAlertDismiss(alert.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Vehicle Types</CardTitle>
            <CardDescription>Distribution of registered vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] mt-4 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1000}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {vehicleTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-7 md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Daily Visitor Trend</CardTitle>
            <CardDescription>Visitor traffic over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] mt-4 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={visitorTrendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#FFBB28" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Access Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Successful Access</span>
                </div>
                <span className="text-sm font-medium">98.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Denied Access</span>
                </div>
                <span className="text-sm font-medium">1.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Temporary Passes</span>
                </div>
                <span className="text-sm font-medium">15/day</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Recurring Visitors</span>
                </div>
                <span className="text-sm font-medium">62%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] overflow-y-auto scrollbar-hide">
            <ActivityLog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
