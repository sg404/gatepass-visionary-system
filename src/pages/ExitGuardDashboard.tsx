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
import { addViolation, hasActiveViolations, getSuspendedVehicles, getViolationsByPlate, getVehiclePenalty } from '@/utils/violationsStorage';
import { addNotification, getUnacknowledgedNotifications, acknowledgeNotification } from '@/utils/notifications';

const ExitGuardDashboard = () => {
  const [currentGuard, setCurrentGuard] = useState<any>(null);
  const navigate = useNavigate();

  // Detection status (for exit guard)
  const [exitDetectionStatus, setExitDetectionStatus] = useState<'idle' | 'detecting' | 'detected'>('idle');

  // Current exiting vehicle info - starts empty (for exit guard)
  const [currentExitingVehicle, setCurrentExitingVehicle] = useState({
    plateNumber: '-',
    rfidTag: '-',
    owner: '-',
    vehicle: '-',
    color: '-',
    time: '-',
    date: '-',
    ownerType: '-',
    isAuthorized: true,
    timeIn: '-',
    hoursStayed: 0
  });

  // Violation reporting state (for both guards)
  const [violationForm, setViolationForm] = useState({
    licensePlate: '',
    ownerName: '',
    ownerType: 'student',
    violationType: 'Parking Violation',
    description: '',
    severity: 'medium',
    location: '',
    image: null as File | null
  });
  const [isViolationDialogOpen, setIsViolationDialogOpen] = useState(false);

  // Previous violations and suspension state
  const [previousViolations, setPreviousViolations] = useState<any[]>([]);
  const [isSuspended, setIsSuspended] = useState(false);

  // Exit guard verification state
  const [exitVerification, setExitVerification] = useState({
    passId: '',
    visitorInfo: null as any,
    verificationStatus: null as 'verified' | 'invalid' | null,
    isVerifying: false
  });

  // Dialog state for verification popup
  const [isVerifyPassDialogOpen, setIsVerifyPassDialogOpen] = useState(false);

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

  // Recent visitors for exit guard
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);

  // Mock vehicle data for simulation (exit guard)
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
      ownerType: 'Faculty',
      isAuthorized: true
    },
    {
      plateNumber: 'VIS2024',
      rfidTag: 'N/A',
      owner: 'Unauthorized Vehicle',
      vehicle: 'Toyota Vios',
      color: 'Silver',
      ownerType: 'Non Teaching Personnel',
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
    if (guard.role !== 'exit') {
      navigate('/guard-login');
      return;
    }
    setCurrentGuard(guard);

    // Load recent visitors for exit guard
    const recent = issuedPasses.slice(-5).reverse();
    setRecentVisitors(recent);
  }, [navigate]);

  // Simulate vehicle detection (exit guard only)
  useEffect(() => {
    if (currentGuard?.role !== 'exit') return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7 && exitDetectionStatus === 'idle') {
        setExitDetectionStatus('detecting');

        setTimeout(() => {
          const randomVehicle = mockVehicles[Math.floor(Math.random() * mockVehicles.length)];
          const timeIn = new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000); // Random time in past 8 hours
          const timeOut = new Date();
          const hoursStayed = Math.round((timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60) * 10) / 10; // Hours with 1 decimal

          const detectedVehicle = {
            ...randomVehicle,
            time: timeOut.toLocaleTimeString(),
            date: timeOut.toLocaleDateString(),
            timeIn: timeIn.toLocaleTimeString(),
            hoursStayed: hoursStayed
          };

          // Check for previous violations and suspension status
          const violations = getViolationsByPlate(randomVehicle.plateNumber);
          const suspendedVehicles = getSuspendedVehicles();
          const isVehicleSuspended = suspendedVehicles.some(vehicle => vehicle === randomVehicle.plateNumber);

          setPreviousViolations(violations);
          setIsSuspended(isVehicleSuspended);
          setCurrentExitingVehicle(detectedVehicle);
          setExitDetectionStatus('detected');

          // Note: Dialog will be opened manually by guard via button

          // Auto clear after 30 seconds for exiting vehicles
          setTimeout(() => {
            setExitDetectionStatus('idle');
            setCurrentExitingVehicle({
              plateNumber: '-',
              rfidTag: '-',
              owner: '-',
              vehicle: '-',
              color: '-',
              time: '-',
              date: '-',
              ownerType: '-',
              isAuthorized: true,
              timeIn: '-',
              hoursStayed: 0
            });
          }, 30000);
        }, 1500);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [exitDetectionStatus, currentGuard]);

  const handleLogout = () => {
    localStorage.removeItem('guardSession');
    navigate('/guard-login');
  };

  // Exit guard functions
  const handleVerifyPass = () => {
    if (!exitVerification.passId.trim()) {
      alert('Please enter a pass ID');
      return;
    }

    setExitVerification(prev => ({ ...prev, isVerifying: true }));

    setTimeout(() => {
      const pass = issuedPasses.find(p => p.id === exitVerification.passId && p.status === 'active');

      if (pass) {
        setExitVerification({
          passId: exitVerification.passId,
          visitorInfo: pass,
          verificationStatus: 'verified',
          isVerifying: false
        });
      } else {
        setExitVerification({
          passId: exitVerification.passId,
          visitorInfo: null,
          verificationStatus: 'invalid',
          isVerifying: false
        });
      }
    }, 1000);
  };

  const handleConfirmExit = () => {
    if (!exitVerification.visitorInfo) return;

    // Mark pass as used
    setIssuedPasses(prev => prev.map(p =>
      p.id === exitVerification.visitorInfo.id
        ? { ...p, status: 'exited', timeOut: new Date().toLocaleTimeString() }
        : p
    ));

    // Update guest count
    setOwnerCounts(prev => ({
      ...prev,
      guests: Math.max(0, prev.guests - 1)
    }));

    alert(`Exit confirmed for ${exitVerification.visitorInfo.fullName}`);

    // Reset verification
    setExitVerification({
      passId: '',
      visitorInfo: null,
      verificationStatus: null,
      isVerifying: false
    });

    // Update recent visitors
    setRecentVisitors(prev => {
      const updated = issuedPasses
        .filter(p => p.status === 'exited')
        .slice(-5)
        .reverse();
      return updated;
    });
  };

  const handleClearVerification = () => {
    setExitVerification({
      passId: '',
      visitorInfo: null,
      verificationStatus: null,
      isVerifying: false
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
      reportedBy: 'Guard',
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

  // Render Exit Guard View
  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-medium text-sm">GP</span>
            </div>
            <h1 className="text-xl font-semibold">Exit Guard Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {currentGuard?.username} (Exit Guard)
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

        <main className="p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Panel - Vehicles Inside */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Exit ANPR Camera Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Live Exit ANPR Camera Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[36rem] bg-muted rounded-lg flex items-center justify-center relative">
                    {exitDetectionStatus === 'idle' && (
                      <div className="text-center space-y-2">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Waiting for exiting vehicle...</p>
                        <Badge variant="outline">ANPR Active</Badge>
                      </div>
                    )}

                    {exitDetectionStatus === 'detecting' && (
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <Camera className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-blue-600 font-medium">Detecting exiting vehicle...</p>
                        <Badge variant="secondary">Scanning</Badge>
                      </div>
                    )}

                    {exitDetectionStatus === 'detected' && (
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                          currentExitingVehicle.isAuthorized
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}>
                          <Car className={`h-8 w-8 ${
                            currentExitingVehicle.isAuthorized
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`} />
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-lg">{currentExitingVehicle.plateNumber}</p>
                          <p className="text-sm text-muted-foreground">{currentExitingVehicle.owner}</p>
                          <Badge variant={currentExitingVehicle.isAuthorized ? "secondary" : "destructive"}>
                            {currentExitingVehicle.ownerType}
                          </Badge>
                          {!currentExitingVehicle.isAuthorized && (
                            <div className="mt-2">
                              <Button
                                onClick={() => setIsVerifyPassDialogOpen(true)}
                                variant="outline"
                                size="sm"
                                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Verify Pass
                              </Button>
                            </div>
                          )}
                        </div>
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

            {/* Secondary Panel - Visitor Pass Verification & Exiting Vehicle Info */}
            <div className="space-y-6">
              {/* Exiting Vehicle & Owner Info */}
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
                      <p className="font-mono font-bold">{currentExitingVehicle.isAuthorized ? currentExitingVehicle.plateNumber : '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">RFID:</p>
                      <p className="font-mono">{currentExitingVehicle.isAuthorized ? currentExitingVehicle.rfidTag : '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Owner:</p>
                      <p>{currentExitingVehicle.isAuthorized ? currentExitingVehicle.owner : '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Vehicle:</p>
                      <p>{currentExitingVehicle.isAuthorized ? currentExitingVehicle.vehicle : '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Color:</p>
                      <p>{currentExitingVehicle.isAuthorized ? currentExitingVehicle.color : '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Time In:</p>
                      <p>{currentExitingVehicle.timeIn}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Time Out:</p>
                      <p>{currentExitingVehicle.time}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Owner Type:</p>
                      <p>{currentExitingVehicle.isAuthorized ? currentExitingVehicle.ownerType : '-'}</p>
                    </div>
                    {currentExitingVehicle.isAuthorized && (
                      <div className="col-span-2 mt-2">
                        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <p className="text-green-800 font-medium">No Previous Violations</p>
                        </div>
                        <p className="text-green-700 text-xs mt-1">This vehicle has a clean record.</p>
                      </div>
                    )}
                  </div>



                  <div className="flex gap-2">
                    <Button onClick={() => {
                      setExitDetectionStatus('idle');
                      setCurrentExitingVehicle({
                        plateNumber: '-',
                        rfidTag: '-',
                        owner: '-',
                        vehicle: '-',
                        color: '-',
                        time: '-',
                        date: '-',
                        ownerType: '-',
                        isAuthorized: true,
                        timeIn: '-',
                        hoursStayed: 0
                      });
                    }} variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
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
                  <SelectItem value="non teaching personnel">Non Teaching Personnel</SelectItem>
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
                  <SelectItem value="parking-roadside-no-parking">Parking on roadside and areas with "No Parking" sign</SelectItem>
                  <SelectItem value="blocking-driveway">Blocking a driveway (obstruction)</SelectItem>
                  <SelectItem value="blocking-sidewalks">Blocking/Parking on sidewalks and path walks (obstruction)</SelectItem>
                  <SelectItem value="parking-intersection">Parking at or inside an intersection</SelectItem>
                  <SelectItem value="parking-pedestrian-crossing">Parking on pedestrian crossings</SelectItem>
                  <SelectItem value="double-parking">Double parking or on the driver side of a parked vehicle</SelectItem>
                  <SelectItem value="parking-near-fire-hydrant">Parking at least 4 meters from a fire hydrant</SelectItem>
                  <SelectItem value="parking-undesignated">Parking on areas not designated as parking space</SelectItem>
                  <SelectItem value="engine-on">Parking and leaving the vehicle with engine on</SelectItem>
                  <SelectItem value="occupying-two-spaces">Occupying two (2) parking spaces</SelectItem>
                  <SelectItem value="expired-rfid">Entering the university premises using an expired or unauthorized RFID tag</SelectItem>
                  <SelectItem value="tampered-rfid">Entering with a tampered or cloned RFID tag</SelectItem>
                  <SelectItem value="mismatched-plate">Entering using a vehicle whose plate number is not recognized or mismatched by the ANPR system</SelectItem>
                  <SelectItem value="using-others-rfid">Using another person's registered RFID tag or vehicle plate for access</SelectItem>
                  <SelectItem value="wrong-vehicle-type">Parking of motorcycles, e-bikes, or tricycles in the designated parking space for 4-wheeled vehicles (or vice versa)</SelectItem>
                  <SelectItem value="other-offenses">Other offenses/violations stated in the policy</SelectItem>
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

      {/* Unauthorized Vehicle Verification Dialog */}
      <Dialog open={isVerifyPassDialogOpen} onOpenChange={setIsVerifyPassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Unauthorized Vehicle Detected
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Vehicle {currentExitingVehicle.plateNumber} is not authorized to exit.</p>
              <p className="text-red-700 text-sm mt-1">Please verify if this vehicle has a valid temporary pass.</p>
            </div>

            <div>
              <Label htmlFor="verifyPassId">Enter Temporary Pass ID</Label>
              <div className="flex gap-2">
                <Input
                  id="verifyPassId"
                  value={exitVerification.passId}
                  onChange={(e) => setExitVerification({ ...exitVerification, passId: e.target.value })}
                  placeholder="Enter pass ID (e.g., TP001234)"
                  className="flex-1"
                />
                <Button onClick={handleVerifyPass} disabled={exitVerification.isVerifying}>
                  {exitVerification.isVerifying ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>

            {/* Verification Status */}
            {exitVerification.verificationStatus && (
              <div className="space-y-4">
                <div className={`flex items-center gap-2 p-4 rounded-lg ${
                  exitVerification.verificationStatus === 'verified'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {exitVerification.verificationStatus === 'verified' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    exitVerification.verificationStatus === 'verified' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {exitVerification.verificationStatus === 'verified' ? 'Pass Verified - Vehicle Authorized' : 'Invalid Pass - Vehicle Not Authorized'}
                  </span>
                </div>

                {/* Visitor Info */}
                {exitVerification.visitorInfo && (
                  <div className="grid grid-cols-1 gap-3 p-4 bg-gray-50 rounded-lg text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-muted-foreground">Name:</span>
                      <span className="font-semibold">{exitVerification.visitorInfo.fullName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-muted-foreground">Vehicle Plate:</span>
                      <span className="font-mono font-semibold">{exitVerification.visitorInfo.licensePlate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-muted-foreground">Purpose:</span>
                      <span>{exitVerification.visitorInfo.purpose}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-muted-foreground">Time In:</span>
                      <span>{exitVerification.visitorInfo.timeIn}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium text-muted-foreground">Pass ID:</span>
                      <span className="font-mono font-semibold">{exitVerification.visitorInfo.id}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsVerifyPassDialogOpen(false);
                      setExitVerification({
                        passId: '',
                        visitorInfo: null,
                        verificationStatus: null,
                        isVerifying: false
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Deny Exit
                  </Button>
                  <Button
                    onClick={handleConfirmExit}
                    disabled={exitVerification.verificationStatus !== 'verified'}
                    className="flex-1"
                  >
                    Allow Exit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExitGuardDashboard;
