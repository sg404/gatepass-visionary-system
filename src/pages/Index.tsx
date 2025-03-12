
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import DashboardView from '@/components/dashboard/DashboardView';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Dashboard"
        description="Overview of your gate pass system"
      >
        <Button variant="ghost" size="sm" className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>
      
      <DashboardView />
    </MainLayout>
  );
};

export default Index;
