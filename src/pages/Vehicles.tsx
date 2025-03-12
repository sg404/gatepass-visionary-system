
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import VehiclesList from '@/components/vehicle/VehiclesList';
import { Button } from '@/components/ui/button';
import { Car, Download } from 'lucide-react';

const Vehicles = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Vehicle Management"
        description="View and manage registered vehicles"
      >
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button size="sm" className="gap-1">
          <Car className="h-4 w-4" />
          Register New
        </Button>
      </PageHeader>
      
      <VehiclesList />
    </MainLayout>
  );
};

export default Vehicles;
