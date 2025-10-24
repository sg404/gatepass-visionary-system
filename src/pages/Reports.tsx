
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Calendar, Users, Car, AlertTriangle, DollarSign, TrendingUp, BarChart3, PieChart, LineChart, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { mockAccessLogs } from '@/data/mockAccessLogs';
import { getViolations } from '@/utils/violationsStorage';

// Mock vehicle entry/exit logs data
const mockVehicleLogs = [
  {
    id: 'LOG001',
    plateNumber: 'ABC1234',
    rfidTag: 'RFID001234',
    owner: 'John Doe',
    vehicleType: 'Sedan',
    entryTime: '2025-01-18 08:30:00',
    exitTime: '2025-01-18 17:45:00',
    duration: '9h 15m',
    ownerType: 'Student',
    status: 'Exited',
    entryGate: 'Main Gate',
    exitGate: 'Main Gate'
  },
  {
    id: 'LOG002',
    plateNumber: 'XYZ9876',
    rfidTag: 'RFID009876',
    owner: 'Dr. Jane Smith',
    vehicleType: 'SUV',
    entryTime: '2025-01-18 09:15:00',
    exitTime: null,
    duration: null,
    ownerType: 'Faculty',
    status: 'Inside Campus',
    entryGate: 'Main Gate',
    exitGate: null
  },
  {
    id: 'LOG003',
    plateNumber: 'VIS2024',
    rfidTag: 'N/A',
    owner: 'Angielou Sujede',
    vehicleType: 'Sedan',
    entryTime: '2025-01-18 10:20:00',
    exitTime: '2025-01-18 12:30:00',
    duration: '2h 10m',
    ownerType: 'Visitor',
    status: 'Exited',
    entryGate: 'Main Gate',
    exitGate: 'Main Gate'
  },
  {
    id: 'LOG004',
    plateNumber: 'DEF5678',
    rfidTag: 'RFID005678',
    owner: 'Mike Johnson',
    vehicleType: 'Motorcycle',
    entryTime: '2025-01-18 11:00:00',
    exitTime: null,
    duration: null,
    ownerType: 'Student',
    status: 'Inside Campus',
    entryGate: 'Side Gate',
    exitGate: null
  },
  {
    id: 'LOG005',
    plateNumber: 'GHI9012',
    rfidTag: 'RFID009012',
    owner: 'Sarah Wilson',
    vehicleType: 'Hatchback',
    entryTime: '2025-01-18 14:15:00',
    exitTime: '2025-01-18 16:20:00',
    duration: '2h 5m',
    ownerType: 'Faculty',
    status: 'Exited',
    entryGate: 'Main Gate',
    exitGate: 'Main Gate'
  }
];

// Mock parking usage data
const mockParkingUsage = {
  totalSlots: 200,
  allocated: 180,
  available: 20,
  occupied: 145,
  studentSlots: 20,
  facultySlots: 160,
  studentOccupied: 12,
  facultyOccupied: 28,
  guestOccupied: 5
};

// Mock visitor data
const mockVisitorData = [
  {
    name: 'Angielou Sujede',
    plate: 'VIS2024',
    visitCount: 3,
    lastVisit: '2025-01-18',
    status: 'Returning'
  },
  {
    name: 'Reynaldo Ilangos',
    plate: 'FAC2024',
    visitCount: 1,
    lastVisit: '2025-01-17',
    status: 'New'
  },
  {
    name: 'Delivery Service',
    plate: 'DEL2024',
    visitCount: 8,
    lastVisit: '2025-01-18',
    status: 'Returning'
  }
];

// Mock guard activity data
const mockGuardActivity = [
  {
    name: 'Christian Porras',
    station: 'Entry Gate',
    vehiclesProcessed: 45,
    violationsReported: 2,
    activeHours: '8.5'
  },
  {
    name: 'David Natan Apruebo',
    station: 'Exit Gate',
    vehiclesProcessed: 38,
    violationsReported: 1,
    activeHours: '7.2'
  },
  {
    name: 'Victor Jom Sorita',
    station: 'Entry Gate',
    vehiclesProcessed: 52,
    violationsReported: 3,
    activeHours: '9.1'
  }
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('vehicle-logs');
  const [dateFilter, setDateFilter] = useState('daily');
  const [ownerTypeFilter, setOwnerTypeFilter] = useState('all');
  const [entryExitFilter, setEntryExitFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isQuickSummaryOpen, setIsQuickSummaryOpen] = useState(false);

  // Filter vehicle logs
  const filteredVehicleLogs = mockVehicleLogs.filter(log => {
    const matchesOwnerType = ownerTypeFilter === 'all' || log.ownerType.toLowerCase() === ownerTypeFilter.toLowerCase();
    const matchesEntryExit = entryExitFilter === 'all' || log.status.toLowerCase().includes(entryExitFilter.toLowerCase());
    return matchesOwnerType && matchesEntryExit;
  });

  // Pagination for vehicle logs
  const totalPages = Math.ceil(filteredVehicleLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicleLogs = filteredVehicleLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleExportPDF = () => {
    // Mock PDF export
    alert('PDF export functionality would be implemented here');
  };

  const handleExportExcel = () => {
    // Mock Excel export
    alert('Excel export functionality would be implemented here');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inside Campus': return 'bg-green-100 text-green-800';
      case 'Exited': return 'bg-blue-100 text-blue-800';
      case 'Denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary statistics
  const todayEntries = mockVehicleLogs.filter(log => log.entryTime?.startsWith('2025-01-18')).length;
  const todayExits = mockVehicleLogs.filter(log => log.exitTime?.startsWith('2025-01-18')).length;
  const weekViolations = getViolations().filter(v => {
    const violationDate = new Date(v.reportedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return violationDate >= weekAgo;
  }).length;
  const penaltiesIssued = getViolations().filter(v => v.penalty).length;

  return (
    <MainLayout>
      <PageHeader
        title="Reports Dashboard"
        description="Comprehensive analytics and logs for Smart Vehicle Gate Pass System"
      >
        <Button variant="outline" size="sm" onClick={() => setIsQuickSummaryOpen(true)}>
          Quick Summary
        </Button>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicle Entries Today</p>
                  <p className="text-2xl font-bold text-blue-600">{todayEntries}</p>
                </div>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicle Exits Today</p>
                  <p className="text-2xl font-bold text-blue-600">{todayExits}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Violations This Week</p>
                  <p className="text-2xl font-bold text-blue-600">{weekViolations}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Penalties Issued</p>
                  <p className="text-2xl font-bold text-blue-600">{penaltiesIssued}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="vehicle-logs">Vehicle Entry/Exit Logs</TabsTrigger>
            <TabsTrigger value="violations">Violations Report</TabsTrigger>
            <TabsTrigger value="penalties">Penalties Report</TabsTrigger>
            <TabsTrigger value="parking">Parking Usage</TabsTrigger>
            <TabsTrigger value="visitors">Visitor Report</TabsTrigger>
            <TabsTrigger value="guards">Guard Activity</TabsTrigger>
          </TabsList>

          {/* Vehicle Entry/Exit Logs Tab */}
          <TabsContent value="vehicle-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Entry/Exit Logs</CardTitle>
                <p className="text-sm text-muted-foreground">Detailed logs of all vehicle gate transactions</p>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Label>Date Range:</Label>
                    <Input
                      type="date"
                      value={dateRangeFilter}
                      onChange={(e) => setDateRangeFilter(e.target.value)}
                      className="w-[150px]"
                    />
                  </div>
                  <Select value={ownerTypeFilter} onValueChange={setOwnerTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Owner Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={entryExitFilter} onValueChange={setEntryExitFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Entry/Exit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="entry">Entry</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plate No.</TableHead>
                        <TableHead>RFID</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Vehicle Type</TableHead>
                        <TableHead>Entry Time</TableHead>
                        <TableHead>Exit Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Owner Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedVehicleLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono font-semibold">{log.plateNumber}</TableCell>
                          <TableCell className="font-mono text-sm">{log.rfidTag}</TableCell>
                          <TableCell>{log.owner}</TableCell>
                          <TableCell>{log.vehicleType}</TableCell>
                          <TableCell className="text-sm">{log.entryTime}</TableCell>
                          <TableCell className="text-sm">{log.exitTime || '-'}</TableCell>
                          <TableCell className="text-sm">{log.duration || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.ownerType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Label>Items per page:</Label>
                      <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVehicleLogs.length)} of {filteredVehicleLogs.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Violations Report Tab */}
          <TabsContent value="violations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Violations Report</CardTitle>
                <p className="text-sm text-muted-foreground">Summary of all reported violations</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plate</TableHead>
                        <TableHead>Violation</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Guard</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getViolations().map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell className="font-mono">{violation.plateNumber}</TableCell>
                          <TableCell>{violation.violationType}</TableCell>
                          <TableCell>
                            <Badge variant={violation.severity === 'high' ? 'destructive' : violation.severity === 'medium' ? 'secondary' : 'outline'}>
                              {violation.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{violation.reportedAt.split(',')[0]}</TableCell>
                          <TableCell>
                            <Badge variant={violation.status === 'resolved' ? 'default' : 'secondary'}>
                              {violation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{violation.reportedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penalties Report Tab */}
          <TabsContent value="penalties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Penalties Report</CardTitle>
                <p className="text-sm text-muted-foreground">Applied penalties and fines</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Owner</TableHead>
                        <TableHead>Plate</TableHead>
                        <TableHead>Penalty Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getViolations().filter(v => v.penalty).map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell>{violation.ownerName}</TableCell>
                          <TableCell className="font-mono">{violation.plateNumber}</TableCell>
                          <TableCell>{violation.penalty?.type}</TableCell>
                          <TableCell>$0.00</TableCell>
                          <TableCell>
                            <Badge variant="outline">Applied</Badge>
                          </TableCell>
                          <TableCell>{violation.penalty?.appliedAt.split(',')[0]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parking Usage Tab */}
          <TabsContent value="parking" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Parking Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Slots</p>
                      <p className="text-2xl font-bold text-blue-600">{mockParkingUsage.totalSlots}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Allocated</p>
                      <p className="text-2xl font-bold text-blue-600">{mockParkingUsage.allocated}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold text-green-600">{mockParkingUsage.available}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                      <p className="text-2xl font-bold text-orange-600">{mockParkingUsage.occupied}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student/Faculty Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Students</span>
                      <span className="text-sm font-medium">{mockParkingUsage.studentOccupied}/{mockParkingUsage.studentSlots}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(mockParkingUsage.studentOccupied/mockParkingUsage.studentSlots)*100}%`}}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Faculty</span>
                      <span className="text-sm font-medium">{mockParkingUsage.facultyOccupied}/{mockParkingUsage.facultySlots}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(mockParkingUsage.facultyOccupied/mockParkingUsage.facultySlots)*100}%`}}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Guests</span>
                      <span className="text-sm font-medium">{mockParkingUsage.guestOccupied}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: `${Math.min(100, (mockParkingUsage.guestOccupied/20)*100)}%`}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Visitor Report Tab */}
          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Report</CardTitle>
                <p className="text-sm text-muted-foreground">Visitor access patterns and statistics</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor Name</TableHead>
                        <TableHead>Plate</TableHead>
                        <TableHead>Visit Count</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockVisitorData.map((visitor, index) => (
                        <TableRow key={index}>
                          <TableCell>{visitor.name}</TableCell>
                          <TableCell className="font-mono">{visitor.plate}</TableCell>
                          <TableCell>{visitor.visitCount}</TableCell>
                          <TableCell>{visitor.lastVisit}</TableCell>
                          <TableCell>
                            <Badge variant={visitor.status === 'New' ? 'default' : 'secondary'}>
                              {visitor.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guard Activity Tab */}
          <TabsContent value="guards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guard Activity Report</CardTitle>
                <p className="text-sm text-muted-foreground">Guard performance and activity metrics</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guard Name</TableHead>
                        <TableHead>Station</TableHead>
                        <TableHead>Vehicles Processed</TableHead>
                        <TableHead>Violations Reported</TableHead>
                        <TableHead>Active Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockGuardActivity.map((guard, index) => (
                        <TableRow key={index}>
                          <TableCell>{guard.name}</TableCell>
                          <TableCell>{guard.station}</TableCell>
                          <TableCell className="text-center">{guard.vehiclesProcessed}</TableCell>
                          <TableCell className="text-center">{guard.violationsReported}</TableCell>
                          <TableCell className="text-center">{guard.activeHours}h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Summary Modal */}
        <Dialog open={isQuickSummaryOpen} onOpenChange={setIsQuickSummaryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{mockVehicleLogs.filter(log => log.status === 'Inside Campus').length}</p>
                  <p className="text-sm text-muted-foreground">Vehicles In</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{todayExits}</p>
                  <p className="text-sm text-muted-foreground">Vehicles Out Today</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Users className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{mockGuardActivity.length}</p>
                  <p className="text-sm text-muted-foreground">Active Guards</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{getViolations().filter(v => v.status !== 'resolved').length}</p>
                  <p className="text-sm text-muted-foreground">Violations Detected</p>
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{Math.round((mockParkingUsage.occupied / mockParkingUsage.totalSlots) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Parking Occupancy</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Reports;
