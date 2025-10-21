import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import VisitorManagement from '@/components/visitor/VisitorManagement';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportAllReports } from '@/utils/reportGenerator';

const Visitors = () => {
  const handleExport = () => {
    exportAllReports();
  };

  return (
    <MainLayout>
      <PageHeader
        title="Visitor Management"
        description="Manage temporary visitors and passes"
      >
        <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Log
        </Button>
      </PageHeader>

      <VisitorManagement />
    </MainLayout>
  );
};

export default Visitors;
