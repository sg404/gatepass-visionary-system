
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Users, GraduationCap } from 'lucide-react';

const ParkingSlotStatus = () => {
  const totalSlots = 100;
  const studentSlots = Math.floor(totalSlots * 0.2); // 20%
  const facultySlots = totalSlots - studentSlots; // 80%
  
  const occupiedStudentSlots = 12;
  const occupiedFacultySlots = 28;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Parking Slot Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Student Parking</span>
              </div>
              <Badge variant="outline">{studentSlots} slots total</Badge>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(occupiedStudentSlots / studentSlots) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Occupied: {occupiedStudentSlots}</span>
              <span>Available: {studentSlots - occupiedStudentSlots}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium">Faculty Parking</span>
              </div>
              <Badge variant="outline">{facultySlots} slots total</Badge>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(occupiedFacultySlots / facultySlots) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Occupied: {occupiedFacultySlots}</span>
              <span>Available: {facultySlots - occupiedFacultySlots}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Total Capacity:</span>
            <span>{totalSlots} slots</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Currently Occupied:</span>
            <span>{occupiedStudentSlots + occupiedFacultySlots} slots</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Available:</span>
            <span className="text-green-600 font-medium">
              {totalSlots - (occupiedStudentSlots + occupiedFacultySlots)} slots
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingSlotStatus;
