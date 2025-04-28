
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Reports = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Reports Management"
        description="View and generate system reports"
      >
        <Button variant="outline" size="sm" className="gap-1">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
        <Button size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </PageHeader>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Entry Summary</CardTitle>
            <CardDescription>Last 30 days statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Entries</span>
                <span className="font-semibold">1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Regular Vehicles</span>
                <span className="font-semibold">892</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Visitor Vehicles</span>
                <span className="font-semibold">353</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
            <CardDescription>Traffic patterns by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Morning Peak (7-9 AM)</span>
                <span className="font-semibold">386 entries</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Afternoon Peak (4-6 PM)</span>
                <span className="font-semibold">412 exits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Daily Traffic</span>
                <span className="font-semibold">245 vehicles</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
