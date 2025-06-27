
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, AlertTriangle, Calendar, Clock, Tag, User, Palette } from 'lucide-react';

interface VehicleInfo {
  plateNumber: string;
  rfidTag: string;
  owner: string;
  model: string;
  brand: string;
  color: string;
  entryTime: string;
  entryDate: string;
  type: 'student' | 'faculty' | 'unauthorized';
}

interface VehicleDetectionPanelProps {
  onUnauthorizedVehicle: (plateNumber: string) => void;
}

const VehicleDetectionPanel: React.FC<VehicleDetectionPanelProps> = ({ onUnauthorizedVehicle }) => {
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'detected'>('idle');
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);

  // Mock vehicle data for simulation
  const mockVehicles: VehicleInfo[] = [
    {
      plateNumber: 'ABC1234',
      rfidTag: 'RFID001234',
      owner: 'John Doe',
      model: 'Civic',
      brand: 'Honda',
      color: 'Blue',
      entryTime: new Date().toLocaleTimeString(),
      entryDate: new Date().toLocaleDateString(),
      type: 'student'
    },
    {
      plateNumber: 'XYZ9876',
      rfidTag: 'RFID009876',
      owner: 'Dr. Jane Smith',
      model: 'Camry',
      brand: 'Toyota',
      color: 'White',
      entryTime: new Date().toLocaleTimeString(),
      entryDate: new Date().toLocaleDateString(),
      type: 'faculty'
    },
    {
      plateNumber: 'VIS2024',
      rfidTag: 'N/A',
      owner: 'Unknown Visitor',
      model: 'Vios',
      brand: 'Toyota',
      color: 'Silver',
      entryTime: new Date().toLocaleTimeString(),
      entryDate: new Date().toLocaleDateString(),
      type: 'unauthorized'
    }
  ];

  // Simulate vehicle detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random vehicle detection
      if (Math.random() > 0.95 && detectionStatus === 'idle') {
        setDetectionStatus('detecting');
        
        setTimeout(() => {
          const randomVehicle = mockVehicles[Math.floor(Math.random() * mockVehicles.length)];
          // Update entry time to current time
          const updatedVehicle = {
            ...randomVehicle,
            entryTime: new Date().toLocaleTimeString(),
            entryDate: new Date().toLocaleDateString()
          };
          
          setVehicleInfo(updatedVehicle);
          setDetectionStatus('detected');
          
          // Auto clear after 15 seconds if authorized
          if (updatedVehicle.type !== 'unauthorized') {
            setTimeout(() => {
              setDetectionStatus('idle');
              setVehicleInfo(null);
            }, 15000);
          }
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [detectionStatus]);

  const handleUnauthorizedAction = () => {
    if (vehicleInfo) {
      onUnauthorizedVehicle(vehicleInfo.plateNumber);
      setDetectionStatus('idle');
      setVehicleInfo(null);
    }
  };

  const handleClearDetection = () => {
    setDetectionStatus('idle');
    setVehicleInfo(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Detection System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          {detectionStatus === 'idle' && (
            <div className="space-y-2">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Waiting for vehicle...</p>
              <Badge variant="outline">System Active</Badge>
            </div>
          )}
          
          {detectionStatus === 'detecting' && (
            <div className="space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-blue-600 font-medium">Detecting vehicle...</p>
              <Badge variant="secondary">Scanning</Badge>
            </div>
          )}
          
          {detectionStatus === 'detected' && vehicleInfo && (
            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                vehicleInfo.type === 'unauthorized' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Car className={`h-8 w-8 ${
                  vehicleInfo.type === 'unauthorized' ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Plate:</span>
                      <span className="font-mono font-bold">{vehicleInfo.plateNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">RFID:</span>
                      <span className="font-mono">{vehicleInfo.rfidTag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Owner:</span>
                      <span>{vehicleInfo.owner}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Vehicle:</span>
                      <span>{vehicleInfo.brand} {vehicleInfo.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Color:</span>
                      <span>{vehicleInfo.color}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Time:</span>
                      <span>{vehicleInfo.entryTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{vehicleInfo.entryDate}</span>
                </div>
                
                <Badge variant={vehicleInfo.type === 'unauthorized' ? 'destructive' : 'secondary'}>
                  {vehicleInfo.type === 'unauthorized' ? 'Unauthorized Visitor' : 
                   vehicleInfo.type === 'faculty' ? 'Faculty Member' : 'Student'}
                </Badge>
              </div>
              
              {vehicleInfo.type === 'unauthorized' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Visitor Detected</span>
                  </div>
                  <Button onClick={handleUnauthorizedAction} variant="destructive" size="sm">
                    Issue Temporary Pass
                  </Button>
                </div>
              )}
              
              <Button onClick={handleClearDetection} variant="outline" size="sm">
                Clear Detection
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDetectionPanel;
