import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Users, LogOut, FileText, GraduationCap, UserCheck, Camera, Bike, Truck, RefreshCw, CheckCircle, XCircle, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addViolation, hasActiveViolations, getSuspendedVehicles, getViolationsByPlate } from '@/utils/violationsStorage';
import { addNotification, getUnacknowledgedNotifications, acknowledgeNotification } from '@/utils/notifications';

const EntryGuardDashboard = () => {
  const [currentGuard, setCurrentGuard] = useState<any>(null);
  const navigate = useNavigate();

  // Detection status (for entry guard)
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'detected'>('idle');

  // Current detected vehicle info - starts empty (for entry guard)
  const [currentVehicle, setCurrentVehicle] = useState({
    plateNumber: '-',
    rfidTag: '-',
    owner: '-',
    vehicle: '-',
    color: '-',
    time: '-',
    date: '-',
    ownerType: '-',
    isAuthorized: true
  });

  // Visitor form state (for entry guard)
  const [visitorForm, setVisitorForm] = useState({
    fullName: '',
    licensePlate: '',
    purpose: '',
    tempPassId: ''
  });

  // Dialog state (for entry guard)
  const [isVisitorDialogOpen, setIsVisitorDialogOpen] = useState(false);

  // Violation reporting state (for both guards)
  const [violationForm, setViolationForm] = useState({
    licensePlate: '',
    ownerName: '',
    ownerType: 'Student',
    violationType: 'Parking Violation',
    description: '',
    severity: 'medium',
    location: '',
    image: null as File | null
  });
  const [isViolationDialogOpen, setIsViolationDialogOpen] = useState(false);

  // Current violations for detected vehicle
  const [currentViolations, setCurrentViolations] = useState<any[]>([]);
  const [isViolationDetailsOpen, setIsViolationDetailsOpen] = useState(false);

  // Verification dialog for unauthorized vehicles
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isDetectionPaused, setIsDetectionPaused] = useState(false);

  // Mock issued passes data (shared between entry and exit guards)
  const [issuedPasses, setIssuedPasses] = useState<any[]>([
    {
      id: 'TP001234',
      fullName: 'John Visitor',
      licensePlate: 'VIS2024',
      purpose: 'Meeting with Dean',
      timeIn: '10:30 AM',
      dateIn: '2025-01-18',
      status: 'active'
    },
    {
      id: 'TP005678',
      fullName: 'Jane Guest',
      licensePlate: 'GST2024',
      purpose: 'Delivery',
      timeIn: '2:15 PM',
      dateIn: '2025-01-18',
      status: 'active'
    }
  ]);

  // Mock vehicle data for simulation (entry guard)
  const mockVehicles = [
    {
      plateNumber: 'ABC1234',
      rfidTag: 'RFID001234',
      owner: 'John Doe',
      vehicle: 'Honda Civic',
      color: 'Blue',
      ownerType: 'Student',
      isAuthorized: true
    },
    {
      plateNumber: 'XYZ9876',
      rfidTag: 'RFID009876',
      owner: 'Dr. Jane Smith',
      vehicle: 'Toyota Camry',
      color: 'White',
      ownerType: 'Faculty Member',
      isAuthorized: true
    },
    {
      plateNumber: 'VIS2024',
      rfidTag: 'N/A',
      owner: 'Unknown Visitor',
      vehicle: 'Toyota Vios',
      color: 'Silver',
      ownerType: 'Unauthorized Visitor',
      isAuthorized: false
    }
  ];

  // Mock data for vehicle counts
  const [vehicleCounts, setVehicleCounts] = useState({
    twowheeler: 15,
    threewheeler: 3,
    fourwheeler: 25,
    sixpluswheeler: 2
  });

  // Mock data for owner allocations
  const totalSlots = 200;
  const studentAllocation = 20;
  const facultyAllocation = 160;

  const [ownerCounts, setOwnerCounts] = useState({
    students: 12,
    faculty: 28,
    guests: 5
  });

  useEffect(() => {
    const guardSession = localStorage.getItem('guardSession');
    if (!guardSession) {
      navigate('/guard-login');
      return;
    }
    const guard = JSON.parse(guardSession);
    if (guard.role !== 'entry') {
      navigate('/guard-login');
      return;
    }
    setCurrentGuard(guard);
  }, [navigate]);

  // Simulate vehicle detection (entry guard only)
  useEffect(() => {
    if (currentGuard?.role !== 'entry' || isDetectionPaused) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.95 && detectionStatus === 'idle') {
        setDetectionStatus('detecting');

        setTimeout(() => {
          const randomVehicle = mockVehicles[Math.floor(Math.random() * mockVehicles.length)];
          const detectedVehicle = {
            ...randomVehicle,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
          };

          setCurrentVehicle(detectedVehicle);
          setDetectionStatus('detected');

          // Fetch violations for the detected vehicle
          const violations = getViolationsByPlate(detectedVehicle.plateNumber);
          setCurrentViolations(violations);

          // For unauthorized vehicles, pause detection and show verification dialog
          if (!detectedVehicle.isAuthorized) {
            setIsDetectionPaused(true);
            setIsVerificationDialogOpen(true);
          } else {
            // Auto clear after 30 seconds for authorized vehicles
            setTimeout(() => {
              setDetectionStatus('idle');
              setCurrentVehicle({
                plateNumber: '-',
                rfidTag: '-',
                owner: '-',
                vehicle: '-',
                color: '-',
                time: '-',
                date: '-',
                ownerType: '-',
                isAuthorized: true
              });
            }, 30000);
          }
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [detectionStatus, currentGuard, isDetectionPaused]);

  const handleLogout = () => {
    localStorage.removeItem('guardSession');
    navigate('/guard-login');
  };

  // Entry guard functions
  const handleIssueTemporaryPass = () => {
    if (!visitorForm.fullName || !visitorForm.licensePlate || !visitorForm.purpose || !visitorForm.tempPassId) {
      alert('Please fill in all fields including the temporary pass ID');
      return;
    }

    // Add to issued passes
    const newPass = {
      id: visitorForm.tempPassId,
      fullName: visitorForm.fullName,
      licensePlate: visitorForm.licensePlate,
      purpose: visitorForm.purpose,
      timeIn: new Date().toLocaleTimeString(),
      dateIn: new Date().toLocaleDateString(),
      status: 'active'
    };
    setIssuedPasses(prev => [...prev, newPass]);

    alert(`Temporary Pass Issued!\nPass ID: ${visitorForm.tempPassId}\nPlease verify this ID at exit.`);

    // Update guest count
    setOwnerCounts(prev => ({
      ...prev,
      guests: prev.guests + 1
    }));

    // Reset form and clear detection
    setVisitorForm({
      fullName: '',
      licensePlate: '',
      purpose: '',
      tempPassId: ''
    });
    setDetectionStatus('idle');
    setCurrentVehicle({
      plateNumber: '-',
      rfidTag: '-',
      owner: '-',
      vehicle: '-',
      color: '-',
      time: '-',
      date: '-',
      ownerType: '-',
      isAuthorized: true
    });
    setIsVisitorDialogOpen(false);
  };

  const handleClearDetection = () => {
    setDetectionStatus('idle');
    setCurrentVehicle({
      plateNumber: '-',
      rfidTag: '-',
      owner: '-',
      vehicle: '-',
      color: '-',
      time: '-',
      date: '-',
      ownerType: '-',
      isAuthorized: true
    });
  };

  // Violation reporting function (for both guards)
  const handleReportViolation = () => {
    if (!violationForm.licensePlate || !violationForm.violationType || !violationForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Create violation in shared storage
    const newViolation = addViolation({
      plateNumber: violationForm.licensePlate,
      ownerName: violationForm.ownerName,
      ownerType: violationForm.ownerType,
      violationType: violationForm.violationType,
      description: violationForm.description,
      severity: violationForm.severity as 'low' | 'medium' | 'high',
      status: 'pending',
      reportedBy: currentGuard?.username || 'Guard',
      location: violationForm.location,
      evidence: violationForm.image ? ['uploaded_image.jpg'] : []
    });

    // Create notification for violation
    addNotification({
      type: 'violation',
      title: 'New Violation Reported',
      message: `${violationForm.violationType} reported for ${violationForm.licensePlate}`,
      plateNumber: violationForm.licensePlate,
      priority: violationForm.severity === 'high' ? 'high' : violationForm.severity === 'medium' ? 'medium' : 'low'
    });

    alert(`Violation Reported Successfully!\nViolation ID: ${newViolation.id}\nPlate: ${violationForm.licensePlate}\nType: ${violationForm.violationType}\nSeverity: ${violationForm.severity}`);

    // Reset form
    setViolationForm({
      licensePlate: '',
      ownerName: '',
      ownerType: 'Student',
      violationType: 'Parking Violation',
      description: '',
      severity: 'medium',
      location: '',
      image: null
    });
    setIsViolationDialogOpen(false);
  };

  const getCapacityStatus = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage >= 100) return { color: 'text-red-600', status: 'Full', progressColor: 'bg-red-500' };
    if (percentage >= 80) return { color: 'text-yellow-600', status: 'Near Full', progressColor: 'bg-yellow-500' };
    return { color: 'text-green-600', status: 'Available', progressColor: 'bg-green-500' };
  };

  const totalOccupied = ownerCounts.students + ownerCounts.faculty + ownerCounts.guests;
  const capacityStatus = getCapacityStatus(totalOccupied, totalSlots);
  const occupancyPercentage = (totalOccupied / totalSlots) * 100;

  // Render Entry Guard View
  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-medium text-sm">GP</span>
            </div>
            <h1 className="text-xl font-semibold">Entry Guard Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {currentGuard?.username} (Entry Guard)
            </span>

            <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600" onClick={() => setIsViolationDialogOpen(true)}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Violation
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <main className="p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Panel - Large */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live ANPR Camera Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Live ANPR Camera Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[36rem] bg-muted rounded-lg flex items-center justify-center relative">
                    {detectionStatus === 'idle' && (
                      <div className="text-center space-y-2">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Waiting for vehicle...</p>
                        <Badge variant="outline">ANPR Active</Badge>
                      </div>
                    )}

                    {detectionStatus === 'detecting' && (
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <Camera className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-blue-600 font-medium">Detecting vehicle...</p>
                        <Badge variant="secondary">Scanning</Badge>
                      </div>
                    )}

                    {detectionStatus === 'detected' && (
                      <div className="text-center space-y-4">
                        {currentVehicle.isAuthorized ? (
                          <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <Car className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="space-y-2">
                              <p className="font-bold text-lg">{currentVehicle.plateNumber}</p>
                              <p className="text-sm text-muted-foreground">{currentVehicle.owner}</p>
                              <Badge variant="secondary">
                                {currentVehicle.ownerType}
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                              <Car className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="space-y-2">
                              <p className="font-bold text-lg text-red-600">Unauthorized Vehicle</p>
                              <p className="text-sm text-muted-foreground">License Plate: {currentVehicle.plateNumber}</p>
                              <p className="text-sm text-muted-foreground">Owner: {currentVehicle.owner}</p>
                              <p className="text-xs text-muted-foreground">Detected: {currentVehicle.date} at {currentVehicle.time}</p>
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Type Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-fit">
                <Card className="bg-white w-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Bike className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">2 Wheeler</p>
                        <p className="text-2xl font-bold">{vehicleCounts.twowheeler}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white w-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">3 Wheeler</p>
                        <p className="text-2xl font-bold">{vehicleCounts.threewheeler}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white w-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">4 Wheeler</p>
                        <p className="text-2xl font-bold">{vehicleCounts.fourwheeler}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>


              </div>

            </div>

            {/* Right Panel - Small */}
            <div className="space-y-6">
              {/* Vehicle & Owner Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle & Owner Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Plate:</p>
                      <p className="font-mono font-bold">{currentVehicle.plateNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">RFID:</p>
                      <p className="font-mono">{currentVehicle.rfidTag}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Owner:</p>
                      <p>{currentVehicle.owner}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Vehicle:</p>
                      <p>{currentVehicle.vehicle}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Color:</p>
                      <p>{currentVehicle.color}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Time:</p>
                      <p>{currentVehicle.time}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Date:</p>
                      <p>{currentVehicle.date}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Owner Type:</p>
                      <p>{currentVehicle.ownerType}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!currentVehicle.isAuthorized && detectionStatus === 'detected' ? (
                      <Button onClick={handleClearDetection} variant="outline" className="flex-1 bg-red-500 text-white hover:bg-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Deny Entry
                      </Button>
                    ) : (
                      <Button onClick={handleClearDetection} variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    )}
                    {!currentVehicle.isAuthorized && detectionStatus === 'detected' && (
                      <Dialog open={isVisitorDialogOpen} onOpenChange={setIsVisitorDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex-1">
                            Issue Pass
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Issue Temporary Pass</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                value={visitorForm.fullName}
                                onChange={(e) => setVisitorForm({ ...visitorForm, fullName: e.target.value })}
                                placeholder="Enter visitor's full name"
                              />
                            </div>

                            <div>
                              <Label htmlFor="licensePlate">License Plate</Label>
                              <Input
                                id="licensePlate"
                                value={visitorForm.licensePlate}
                                onChange={(e) => setVisitorForm({ ...visitorForm, licensePlate: e.target.value })}
                                placeholder="Enter license plate"
                              />
                            </div>

                            <div>
                              <Label htmlFor="purpose">Purpose of Visit</Label>
                              <Select value={visitorForm.purpose} onValueChange={(value) => setVisitorForm({ ...visitorForm, purpose: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="delivery">Delivery</SelectItem>
                                  <SelectItem value="meeting-dean">Meeting with Dean</SelectItem>
                                  <SelectItem value="meeting-faculty">Meeting with Faculty</SelectItem>
                                  <SelectItem value="meeting-staff">Meeting with Staff</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                  <SelectItem value="event">Event/Program</SelectItem>
                                  <SelectItem value="others">Others</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="tempPassId">Temporary Pass ID</Label>
                              <Input
                                id="tempPassId"
                                value={visitorForm.tempPassId}
                                onChange={(e) => setVisitorForm({ ...visitorForm, tempPassId: e.target.value })}
                                placeholder="Enter temporary pass ID (e.g., TP001234)"
                              />
                            </div>

                            <Button onClick={handleIssueTemporaryPass} className="w-full">
                              Issue Temporary Pass
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {currentViolations.length > 0 && detectionStatus === 'detected' && (
                      <Dialog open={isViolationDetailsOpen} onOpenChange={setIsViolationDetailsOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            View Violations ({currentViolations.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Vehicle Violations - {currentVehicle.plateNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {currentViolations.map((violation: any) => (
                              <Card key={violation.id} className="p-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold">{violation.violationType}</p>
                                      <p className="text-sm text-muted-foreground">ID: {violation.id}</p>
                                    </div>
                                    <Badge variant={violation.severity === 'high' ? 'destructive' : violation.severity === 'medium' ? 'secondary' : 'outline'}>
                                      {violation.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm">{violation.description}</p>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Reported by: {violation.reportedBy}</span>
                                    <span>Location: {violation.location}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Status: {violation.status}</span>
                                    <span>Date: {new Date(violation.timestamp).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Parking Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Parking Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Total Slots Summary */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">{totalSlots}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                      <p className="text-xl font-bold">{totalOccupied}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available</p>
                      <p className="text-xl font-bold">{Math.max(0, totalSlots - totalOccupied)}</p>
                    </div>
                  </div>
                  {/* Occupancy Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Occupancy</span>
                      <span>{occupancyPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={occupancyPercentage} className="h-2" />
                    <div className="flex justify-center mt-1">
                      <Badge variant={capacityStatus.status === 'Full' ? 'destructive' : capacityStatus.status === 'Near Full' ? 'secondary' : 'outline'} className={capacityStatus.color}>
                        {capacityStatus.status}
                      </Badge>
                    </div>
                  </div>
                  {/* Role Allocations */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Allocations</p>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>Students</span>
                            <span>{ownerCounts.students} / {studentAllocation}</span>
                          </div>
                          <Progress value={(ownerCounts.students / studentAllocation) * 100} className="h-1.5 mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>Faculty</span>
                            <span>{ownerCounts.faculty} / {facultyAllocation}</span>
                          </div>
                          <Progress value={(ownerCounts.faculty / facultyAllocation) * 100} className="h-1.5 mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>Guests</span>
                            <span>{ownerCounts.guests}</span>
                          </div>
                          <Progress value={Math.min(100, (ownerCounts.guests / 20) * 100)} className="h-1.5 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

      </div>

      {/* Violation Reporting Dialog */}
      <Dialog open={isViolationDialogOpen} onOpenChange={setIsViolationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Violation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="violationPlate">License Plate</Label>
              <Input
                id="violationPlate"
                value={violationForm.licensePlate}
                onChange={(e) => setViolationForm({ ...violationForm, licensePlate: e.target.value })}
                placeholder="Enter license plate"
              />
            </div>

            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={violationForm.ownerName}
                onChange={(e) => setViolationForm({ ...violationForm, ownerName: e.target.value })}
                placeholder="Enter owner name"
              />
            </div>

            <div>
              <Label htmlFor="ownerType">Owner Type</Label>
              <Select value={violationForm.ownerType} onValueChange={(value) => setViolationForm({ ...violationForm, ownerType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="violationType">Violation Type</Label>
              <Select value={violationForm.violationType} onValueChange={(value) => setViolationForm({ ...violationForm, violationType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unauthorized-parking">Unauthorized Parking</SelectItem>
                  <SelectItem value="overstay">Overstay</SelectItem>
                  <SelectItem value="wrong-zone">Wrong Zone</SelectItem>
                  <SelectItem value="no-permit">No Permit</SelectItem>
                  <SelectItem value="blocked-access">Blocked Access</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="violationDescription">Description</Label>
              <Textarea
                id="violationDescription"
                value={violationForm.description}
                onChange={(e) => setViolationForm({ ...violationForm, description: e.target.value })}
                placeholder="Describe the violation"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="violationSeverity">Severity</Label>
              <Select value={violationForm.severity} onValueChange={(value) => setViolationForm({ ...violationForm, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={violationForm.location}
                onChange={(e) => setViolationForm({ ...violationForm, location: e.target.value })}
                placeholder="Enter location (e.g., Parking Lot A, Block 3)"
              />
            </div>

            <div>
              <Label htmlFor="violationImage">Upload Image (Optional)</Label>
              <Input
                id="violationImage"
                type="file"
                accept="image/*"
                onChange={(e) => setViolationForm({ ...violationForm, image: e.target.files ? e.target.files[0] : null })}
              />
            </div>

            <Button onClick={handleReportViolation} className="w-full">
              Report Violation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog for Unauthorized Vehicles */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Unauthorized Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Car className="h-8 w-8 text-red-600" />
              </div>
              <p className="font-semibold text-lg">Unauthorized Vehicle Detected</p>
              <p className="text-sm text-muted-foreground">
                License Plate: <span className="font-mono font-bold">{currentVehicle.plateNumber}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Owner: {currentVehicle.owner}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Action Required:</strong> This vehicle is not authorized to enter. Please verify the visitor's identity and purpose before proceeding.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsVerificationDialogOpen(false);
                  setIsDetectionPaused(false);
                  setDetectionStatus('idle');
                  setCurrentVehicle({
                    plateNumber: '-',
                    rfidTag: '-',
                    owner: '-',
                    vehicle: '-',
                    color: '-',
                    time: '-',
                    date: '-',
                    ownerType: '-',
                    isAuthorized: true
                  });
                }}
                variant="outline"
                className="flex-1 bg-red-500 text-white hover:bg-red-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deny Entry
              </Button>
              <Button
                onClick={() => {
                  setIsVerificationDialogOpen(false);
                  setIsVisitorDialogOpen(true);
                }}
                className="flex-1"
              >
                Proceed to Issue Pass
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EntryGuardDashboard;
