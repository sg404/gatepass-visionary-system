
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import VisitorManagement from '@/components/visitor/VisitorManagement';
import { Button } from '@/components/ui/button';
import { UserPlus, Download } from 'lucide-react';

const Visitors = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Visitor Management"
        description="Manage temporary visitors and passes"
      >
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export Log
        </Button>
        <Button size="sm" className="gap-1">
          <UserPlus className="h-4 w-4" />
          Add Visitor
        </Button>
      </PageHeader>
      
      <VisitorManagement />
    </MainLayout>
  );
};

export default Visitors;
