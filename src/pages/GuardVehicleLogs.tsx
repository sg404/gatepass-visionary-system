
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleEntryLogs from './VehicleEntryLogs';

const GuardVehicleLogs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center px-6 bg-background/80 backdrop-blur-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/guard-dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-xl font-semibold">Vehicle Entry/Exit Logs</h1>
      </header>
      
      <div className="p-6">
        <VehicleEntryLogs />
      </div>
    </div>
  );
};

export default GuardVehicleLogs;
