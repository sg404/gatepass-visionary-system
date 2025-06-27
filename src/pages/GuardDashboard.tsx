
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Users, AlertTriangle, LogOut, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleDetectionPanel from '@/components/guard/VehicleDetectionPanel';
import VisitorFormModal from '@/components/guard/VisitorFormModal';
import ParkingSlotStatus from '@/components/guard/ParkingSlotStatus';

const GuardDashboard = () => {
  const [detectedVehicle, setDetectedVehicle] = useState<string | null>(null);
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [currentGuard, setCurrentGuard] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const guardSession = localStorage.getItem('guardSession');
    if (!guardSession) {
      navigate('/guard-login');
      return;
    }
    setCurrentGuard(JSON.parse(guardSession));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('guardSession');
    navigate('/guard-login');
  };

  const handleUnauthorizedVehicle = (plateNumber: string) => {
    setDetectedVehicle(plateNumber);
    setShowVisitorForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-medium text-sm">GP</span>
          </div>
          <h1 className="text-xl font-semibold">Guard Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {currentGuard?.username}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigate('/guard/vehicle-logs')}>
            <FileText className="h-4 w-4 mr-2" />
            View Logs
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Vehicles Today</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Visitors</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Alerts</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">On Duty</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <VehicleDetectionPanel onUnauthorizedVehicle={handleUnauthorizedVehicle} />
          <ParkingSlotStatus />
        </div>
        
        <VisitorFormModal 
          isOpen={showVisitorForm}
          onClose={() => setShowVisitorForm(false)}
          detectedPlateNumber={detectedVehicle}
        />
      </main>
    </div>
  );
};

export default GuardDashboard;
