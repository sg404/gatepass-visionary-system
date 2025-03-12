
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';

const Security = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Security"
        description="Monitor and manage gate security operations"
      >
        <Button variant="ghost" size="sm" className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>
      
      <SecurityDashboard />
    </MainLayout>
  );
};

export default Security;
