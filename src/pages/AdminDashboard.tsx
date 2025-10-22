import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Car, Shield, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Vehicles',
      value: '1,234',
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/vehicles'
    },
    {
      title: 'Active Visitors',
      value: '89',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/visitors'
    },
    {
      title: 'Security Alerts',
      value: '12',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/security'
    },
    {
      title: 'Reports Generated',
      value: '45',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/reports'
    }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of gatepass management system"
      />

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(stat.path)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/vehicles')}>
                <Car className="h-6 w-6" />
                Manage Vehicles
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/visitors')}>
                <Users className="h-6 w-6" />
                Visitor Management
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/violations')}>
                <AlertTriangle className="h-6 w-6" />
                View Violations
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/access-logs')}>
                <TrendingUp className="h-6 w-6" />
                Access Logs
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/reports')}>
                <FileText className="h-6 w-6" />
                Generate Reports
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/settings')}>
                <Shield className="h-6 w-6" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
