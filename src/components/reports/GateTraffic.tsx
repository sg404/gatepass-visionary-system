
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyData = [
  { time: '6 AM', newSite: 45, oldSite: 35 },
  { time: '9 AM', newSite: 85, oldSite: 75 },
  { time: '12 PM', newSite: 65, oldSite: 55 },
  { time: '3 PM', newSite: 95, oldSite: 85 },
  { time: '6 PM', newSite: 75, oldSite: 65 },
  { time: '9 PM', newSite: 35, oldSite: 25 },
];

const weeklyData = [
  { day: 'Mon', newSite: 350, oldSite: 300 },
  { day: 'Tue', newSite: 380, oldSite: 320 },
  { day: 'Wed', newSite: 420, oldSite: 380 },
  { day: 'Thu', newSite: 390, oldSite: 340 },
  { day: 'Fri', newSite: 450, oldSite: 400 },
  { day: 'Sat', newSite: 200, oldSite: 180 },
  { day: 'Sun', newSite: 150, oldSite: 130 },
];

const monthlyData = [
  { week: 'Week 1', newSite: 1200, oldSite: 1000 },
  { week: 'Week 2', newSite: 1400, oldSite: 1200 },
  { week: 'Week 3', newSite: 1300, oldSite: 1100 },
  { week: 'Week 4', newSite: 1500, oldSite: 1300 },
];

export const GateTraffic = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Gate Traffic Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newSite" name="New Site Gate" fill="#0ea5e9" />
                <Bar dataKey="oldSite" name="Old Site Gate" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newSite" name="New Site Gate" fill="#0ea5e9" />
                <Bar dataKey="oldSite" name="Old Site Gate" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newSite" name="New Site Gate" fill="#0ea5e9" />
                <Bar dataKey="oldSite" name="Old Site Gate" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
