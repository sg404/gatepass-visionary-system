
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const ReportStatistics = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Entries</CardTitle>
          <CardDescription>All gates combined</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,547</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>
          <CardDescription>This month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">412</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parking Occupied</CardTitle>
          <CardDescription>Current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78%</div>
          <p className="text-xs text-muted-foreground">145/185 spaces</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Gates</CardTitle>
          <CardDescription>Operating status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2/2</div>
          <p className="text-xs text-muted-foreground">All gates operational</p>
        </CardContent>
      </Card>
    </div>
  );
};
