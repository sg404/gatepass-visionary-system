
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, UserCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';

const SecurityDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Guards"
          value="4"
          icon={Shield}
          trend={{ value: 0, isPositive: true }}
          description="Currently on duty"
        />
        <StatCard 
          title="Security Alerts"
          value="2"
          icon={AlertTriangle}
          trend={{ value: 1, isPositive: false }}
          colorScheme="destructive"
          description="Unresolved issues"
        />
        <StatCard 
          title="Verified Entries"
          value="128"
          icon={UserCheck}
          trend={{ value: 12, isPositive: true }}
          description="Today's entries"
        />
        <StatCard 
          title="Average Response"
          value="45s"
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
          description="Gate response time"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Active Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                  <span className="font-medium">Main Entrance</span>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                  <span className="font-medium">Back Gate</span>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Inactive</Badge>
                  <span className="font-medium">Service Entrance</span>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Security Personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>On Duty</Badge>
                  <span className="font-medium">John Smith</span>
                </div>
                <span className="text-sm text-muted-foreground">Main Gate</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>On Duty</Badge>
                  <span className="font-medium">Sarah Wilson</span>
                </div>
                <span className="text-sm text-muted-foreground">Back Gate</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Off Duty</Badge>
                  <span className="font-medium">Mike Johnson</span>
                </div>
                <span className="text-sm text-muted-foreground">-</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;
