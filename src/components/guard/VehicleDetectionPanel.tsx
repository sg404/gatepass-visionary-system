
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, AlertTriangle } from 'lucide-react';

interface VehicleDetectionPanelProps {
  onUnauthorizedVehicle: (plateNumber: string) => void;
}

const VehicleDetectionPanel: React.FC<VehicleDetectionPanelProps> = ({ onUnauthorizedVehicle }) => {
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'detected'>('idle');
  const [detectedPlate, setDetectedPlate] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<'student' | 'faculty' | 'unauthorized' | null>(null);

  // Simulate vehicle detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random vehicle detection
      if (Math.random() > 0.95 && detectionStatus === 'idle') {
        setDetectionStatus('detecting');
        
        setTimeout(() => {
          const plates = ['ABC1234', 'XYZ9876', 'VIS2024', 'UNK5678'];
          const randomPlate = plates[Math.floor(Math.random() * plates.length)];
          setDetectedPlate(randomPlate);
          
          // Determine vehicle type based on plate
          if (randomPlate.startsWith('VIS') || randomPlate.startsWith('UNK')) {
            setVehicleType('unauthorized');
          } else if (Math.random() > 0.7) {
            setVehicleType('faculty');
          } else {
            setVehicleType('student');
          }
          
          setDetectionStatus('detected');
          
          // Auto clear after 10 seconds if authorized
          if (!randomPlate.startsWith('VIS') && !randomPlate.startsWith('UNK')) {
            setTimeout(() => {
              setDetectionStatus('idle');
              setDetectedPlate('');
              setVehicleType(null);
            }, 10000);
          }
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [detectionStatus]);

  const handleUnauthorizedAction = () => {
    onUnauthorizedVehicle(detectedPlate);
    setDetectionStatus('idle');
    setDetectedPlate('');
    setVehicleType(null);
  };

  const handleClearDetection = () => {
    setDetectionStatus('idle');
    setDetectedPlate('');
    setVehicleType(null);
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
          
          {detectionStatus === 'detected' && (
            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                vehicleType === 'unauthorized' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Car className={`h-8 w-8 ${
                  vehicleType === 'unauthorized' ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              
              <div className="space-y-2">
                <p className="font-mono text-lg font-bold">{detectedPlate}</p>
                <Badge variant={vehicleType === 'unauthorized' ? 'destructive' : 'secondary'}>
                  {vehicleType === 'unauthorized' ? 'Unauthorized' : 
                   vehicleType === 'faculty' ? 'Faculty' : 'Student'}
                </Badge>
              </div>
              
              {vehicleType === 'unauthorized' && (
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
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDetectionPanel;
