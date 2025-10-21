import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Users, LogOut, FileText, GraduationCap, UserCheck, Camera, Bike, Truck, RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuardDashboard = () => {
  const [currentGuard, setCurrentGuard] = useState<any>(null);
  const navigate = useNavigate();

  // Detection status (for entry guard)
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'detected'>('idle');

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

  // Exit guard verification state
  const [exitVerification, setExitVerification] = useState({
    passId: '',
    visitorInfo: null as any,
    verificationStatus: null as 'verified' | 'invalid' | null,
    isVerifying: false
  });

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

  useEffect(() => {
    const guardSession = localStorage.getItem('guardSession');
    if (!guardSession) {
      navigate('/guard-login');
      return;
    }
    const guard = JSON.parse(guardSession);
    setCurrentGuard(guard);

    // Load recent visitors for exit guard
    if (guard.role === 'exit') {
      const recent = issuedPasses.slice(-5).reverse();
      setRecentVisitors(recent);
    }
  }, [navigate]);

  // Simulate vehicle detection (entry guard only)
  useEffect(() => {
    if (currentGuard?.role !== 'entry') return;

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

          // Auto clear after 30 seconds for authorized vehicles
          if (detectedVehicle.isAuthorized) {
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
  }, [detectionStatus, currentGuard]);

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
  if (currentGuard?.role === 'entry') {
    return (
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
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                          currentVehicle.isAuthorized ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Car className={`h-8 w-8 ${
                            currentVehicle.isAuthorized ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-lg">{currentVehicle.plateNumber}</p>
                          <p className="text-sm text-muted-foreground">{currentVehicle.owner}</p>
                          <Badge variant={currentVehicle.isAuthorized ? 'secondary' : 'destructive'}>
                            {currentVehicle.ownerType}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Type Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 h-fit">
                <Card className="bg-white">
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

                <Card className="bg-white">
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

                <Card className="bg-white">
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

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">6+ Wheeler</p>
                        <p className="text-2xl font-bold">{vehicleCounts.sixpluswheeler}</p>
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
                    <Button onClick={handleClearDetection} variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
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
                  </div>
                </CardContent>
              </Card>

              {/* Total Parking Slots */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Total Parking Slots</p>
                          <p className="text-2xl font-bold"><span className="text-xl font-extrabold">{totalOccupied}</span>/{totalSlots}</p>
                        </div>
                      </div>
                      <Badge variant={capacityStatus.status === 'Full' ? 'destructive' : 'secondary'}
                             className={capacityStatus.color}>
                        {capacityStatus.status}
                      </Badge>
                    </div>
                    <Progress value={occupancyPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Owner Type Cards */}
              <div className="grid gap-4 grid-cols-1">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Students</p>
                        <p className="text-lg font-bold"><span className="text-xl font-extrabold">{ownerCounts.students}</span>/{studentAllocation}</p>
                        <Progress value={(ownerCounts.students / studentAllocation) * 100} className="h-2 mt-2" style={{ '--progress-foreground': '#7c3aed' } as React.CSSProperties} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Faculty</p>
                        <p className="text-lg font-bold"><span className="text-xl font-extrabold">{ownerCounts.faculty}</span>/{facultyAllocation}</p>
                        <Progress value={(ownerCounts.faculty / facultyAllocation) * 100} className="h-2 mt-2" style={{ '--progress-foreground': '#16a34a' } as React.CSSProperties} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Guests</p>
                        <p className="text-xl font-extrabold">{ownerCounts.guests}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Mock system alerts for exit guard
  const systemAlerts = [
    { type: 'warning', message: 'Parking nearing capacity (85% occupied)', icon: '⚠️' },
    { type: 'info', message: '2 unauthorized vehicles detected', icon: '🚫' },
    { type: 'alert', message: '3 visitors overstaying (over 4 hours)', icon: '⏰' }
  ];

  // Mock recent movements data
  const recentMovements = [
    { plate: 'ABC1234', ownerType: 'Student', timeIn: '8:30 AM', timeOut: '4:15 PM', status: 'Exited' },
    { plate: 'XYZ5678', ownerType: 'Faculty', timeIn: '9:00 AM', timeOut: null, status: 'Inside' },
    { plate: 'VIS001', ownerType: 'Guest', timeIn: '10:15 AM', timeOut: '2:30 PM', status: 'Exited' },
    { plate: 'DEF9012', ownerType: 'Student', timeIn: '7:45 AM', timeOut: null, status: 'Inside' },
    { plate: 'GHI3456', ownerType: 'Faculty', timeIn: '8:00 AM', timeOut: null, status: 'Inside' },
    { plate: 'VIS002', ownerType: 'Guest', timeIn: '11:00 AM', timeOut: null, status: 'Overstay' }
  ];

  // Mock violations
  const violations = [
    { plate: 'VIS002', type: 'Overstay', description: 'Visitor exceeded 4-hour limit', severity: 'high' },
    { plate: 'XYZ9999', type: 'Unauthorized', description: 'No valid RFID tag', severity: 'medium' }
  ];

  // Render Exit Guard View
  if (currentGuard?.role === 'exit') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with Alerts */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">GP</span>
                </div>
                <h1 className="text-xl font-semibold">Exit Gate – Campus Vehicle Overview</h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {currentGuard?.username} (Exit Guard)
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
            </div>

            {/* System Alerts */}
            <div className="mt-4 space-y-2">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                  alert.type === 'alert' ? 'bg-red-50 text-red-800 border border-red-200' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  <span>{alert.icon}</span>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Panel - Vehicles Inside / Parking Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Total Parking Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Total Parking Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{totalOccupied}/{totalSlots}</p>
                        <p className="text-sm text-muted-foreground">slots occupied</p>
                      </div>
                      <Badge variant={capacityStatus.status === 'Full' ? 'destructive' : 'secondary'}
                             className={capacityStatus.color}>
                        {capacityStatus.status}
                      </Badge>
                    </div>
                    <Progress value={occupancyPercentage} className="h-3 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Owner Type Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Owner Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Students</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{ownerCounts.students}/{studentAllocation}</span>
                    </div>
                    <Progress value={(ownerCounts.students / studentAllocation) * 100} className="h-2 rounded-full" style={{ '--progress-foreground': '#7c3aed' } as React.CSSProperties} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Faculty</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{ownerCounts.faculty}/{facultyAllocation}</span>
                    </div>
                    <Progress value={(ownerCounts.faculty / facultyAllocation) * 100} className="h-2 rounded-full" style={{ '--progress-foreground': '#16a34a' } as React.CSSProperties} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Guests</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{ownerCounts.guests} (added to faculty)</span>
                    </div>
                    <Progress value={(ownerCounts.guests / (facultyAllocation - ownerCounts.faculty)) * 100} className="h-2 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Current Vehicles Inside Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Vehicles Inside Campus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{ownerCounts.students}</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{ownerCounts.faculty}</p>
                      <p className="text-sm text-muted-foreground">Faculty</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{ownerCounts.guests}</p>
                      <p className="text-sm text-muted-foreground">Guests</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-3xl font-bold">{totalOccupied}</p>
                    <p className="text-sm text-muted-foreground">Total Vehicles Inside</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Panel - Visitor Pass Verification */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Visitor Pass Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="passId">Temporary Pass Input / Scan</Label>
                    <div className="flex gap-2">
                      <Input
                        id="passId"
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
                          {exitVerification.verificationStatus === 'verified' ? 'Pass Verified' : 'Invalid Pass ID'}
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
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium text-muted-foreground">Owner Type:</span>
                            <span>Guest</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={handleConfirmExit}
                          disabled={exitVerification.verificationStatus !== 'verified'}
                          className="flex-1"
                        >
                          Confirm Exit
                        </Button>
                        <Button onClick={handleClearVerification} variant="outline" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear / Reset
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section - Recent Movements and Violations */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Vehicle/Visitor Movements Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Vehicle/Visitor Movements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">License Plate</th>
                        <th className="text-left p-2">Owner Type</th>
                        <th className="text-left p-2">Time In</th>
                        <th className="text-left p-2">Time Out</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMovements.map((movement, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-mono">{movement.plate}</td>
                          <td className="p-2">{movement.ownerType}</td>
                          <td className="p-2">{movement.timeIn}</td>
                          <td className="p-2">{movement.timeOut || '-'}</td>
                          <td className="p-2">
                            <Badge variant={
                              movement.status === 'Exited' ? 'secondary' :
                              movement.status === 'Overstay' ? 'destructive' :
                              'outline'
                            }>
                              {movement.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Violations Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Pending Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {violations.map((violation, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      violation.severity === 'high' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold">{violation.plate}</span>
                        <Badge variant={violation.severity === 'high' ? 'destructive' : 'secondary'}>
                          {violation.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
                    </div>
                  ))}
                  {violations.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No pending violations</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default GuardDashboard;
