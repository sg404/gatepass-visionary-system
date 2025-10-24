import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { AlertTriangle, FileText, Plus, Search, Filter, Eye, CheckCircle, XCircle, Download, Gavel, MoreHorizontal, Calendar, Clock, Tag, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportAllReports } from '@/utils/reportGenerator';
import { getVehiclePenalty, getViolationsByPlate } from '@/utils/violationsStorage';
import { mockRegistrations } from '@/data/mockRegistrations';

const Violations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [violationTypeFilter, setViolationTypeFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [plateFilter, setPlateFilter] = useState('all');
  const [dateFilterType, setDateFilterType] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [isPenaltyDialogOpen, setIsPenaltyDialogOpen] = useState(false);
  const [penaltyNotes, setPenaltyNotes] = useState('');

  // Check if user is a guard (only guards can report violations)
  const guardSession = localStorage.getItem('guardSession');
  const isGuard = !!guardSession;
  const isAdmin = !isGuard;

  // Mock violations data with RFID tags and enhanced fields
  const [violations, setViolations] = useState([
    {
      id: 'V001',
      plateNumber: 'ABC1234',
      rfidTag: 'RFID001234',
      ownerName: 'Jane Student',
      ownerType: 'Student',
      violationType: 'Parking Violation',
      description: 'Parked in faculty-only zone',
      severity: 'low',
      status: 'resolved',
      reportedBy: 'Guard',
      reportedAt: '2025-01-17 16:45',
      date: '2025-01-17',
      time: '16:45',
      location: 'Faculty Parking Zone A',
      evidence: ['violation_photo.jpg'],
      offenseCount: 1,
      resolution: {
        action: 'Warning Issued',
        resolvedBy: 'Security Officer - Charlie',
        resolvedAt: '2025-01-17 17:00',
        notes: 'Student was unaware of parking rules. Verbal warning given.'
      }
    },
    {
      id: 'V002',
      plateNumber: 'DEF5678',
      rfidTag: 'RFID005678',
      ownerName: 'Dr. Smith',
      ownerType: 'Faculty',
      violationType: 'Unauthorized Parking',
      description: 'Parked in restricted area without permit',
      severity: 'high',
      status: 'pending',
      reportedBy: 'Guard',
      reportedAt: '2025-01-18 11:20',
      date: '2025-01-18',
      time: '11:20',
      location: 'Main Campus Road',
      evidence: ['guard_report.jpg'],
      offenseCount: 2,
      resolution: null
    },
    {
      id: 'V003',
      plateNumber: 'GHI9012',
      rfidTag: 'RFID009012',
      ownerName: 'John Faculty',
      ownerType: 'Faculty',
      violationType: 'Overstay',
      description: 'Vehicle parked beyond allowed time limit',
      severity: 'medium',
      status: 'investigating',
      reportedBy: 'Guard',
      reportedAt: '2025-01-19 09:15',
      date: '2025-01-19',
      time: '09:15',
      location: 'Student Parking Lot',
      evidence: ['guard_notes.jpg'],
      offenseCount: 1,
      resolution: null
    }
  ]);

  // Report violation form state
  const [violationReport, setViolationReport] = useState({
    plateNumber: '',
    ownerName: '',
    ownerType: 'Student',
    violationType: 'Parking Violation',
    description: '',
    severity: 'medium',
    location: '',
    image: null as File | null,
    evidence: [] as string[]
  });

  const handleReportViolation = () => {
    const now = new Date();
    const newViolation = {
      id: `V${String(violations.length + 1).padStart(3, '0')}`,
      plateNumber: violationReport.plateNumber,
      rfidTag: `RFID${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`, // Generate random RFID for demo
      ownerName: violationReport.ownerName,
      ownerType: violationReport.ownerType,
      violationType: violationReport.violationType,
      description: violationReport.description,
      severity: violationReport.severity,
      status: 'pending',
      reportedBy: 'Guard', // In real app, get from session
      reportedAt: now.toLocaleString(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      location: violationReport.location,
      evidence: violationReport.evidence,
      offenseCount: getViolationsByPlate(violationReport.plateNumber).length + 1,
      resolution: null
    };

    setViolations(prev => [newViolation, ...prev]);
    setViolationReport({
      plateNumber: '',
      ownerName: '',
      ownerType: 'Student',
      violationType: 'Parking Violation',
      description: '',
      severity: 'medium',
      location: '',
      image: null,
      evidence: []
    });
    setIsReportDialogOpen(false);
  };

  const handleResolveViolation = (violationId: string, action: string, notes: string) => {
    setViolations(prev => prev.map(v =>
      v.id === violationId
        ? {
            ...v,
            status: 'resolved',
            resolution: {
              action,
              resolvedBy: 'Current Guard', // In real app, get from session
              resolvedAt: new Date().toLocaleString(),
              notes
            }
          }
        : v
    ));
  };

  const handleApplyPenalty = (violation: any) => {
    const penalty = getVehiclePenalty(violation.plateNumber);
    const penaltyType = penalty.isSuspended ? `${penalty.penalty}${penalty.duration ? ` (${penalty.duration})` : ''}` : penalty.penalty;

    setViolations(prev => prev.map(v =>
      v.id === violation.id
        ? {
            ...v,
            penalty: {
              type: penaltyType,
              duration: penalty.duration,
              appliedBy: 'Current Admin', // In real app, get from session
              appliedAt: new Date().toLocaleString(),
              notes: penaltyNotes
            }
          }
        : v
    ));

    setIsPenaltyDialogOpen(false);
    setPenaltyNotes('');
    setSelectedViolation(null);
  };

  const handleApplySpecificPenalty = (violation: any, penaltyType: string) => {
    let duration = null;
    let isSuspended = false;

    if (penaltyType.includes('Suspension')) {
      isSuspended = true;
      if (penaltyType.includes('1-Month')) {
        duration = '1 Month';
      } else if (penaltyType.includes('6-Month')) {
        duration = '6 Months';
      }
    }

    setViolations(prev => prev.map(v =>
      v.id === violation.id
        ? {
            ...v,
            penalty: {
              type: penaltyType,
              duration: duration,
              appliedBy: 'Current Admin', // In real app, get from session
              appliedAt: new Date().toLocaleString(),
              notes: `Penalty applied: ${penaltyType}`
            }
          }
        : v
    ));
  };

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.violationType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;
    const matchesViolationType = violationTypeFilter === 'all' || violation.violationType === violationTypeFilter;
    const matchesOwner = ownerFilter === 'all' || violation.ownerName === ownerFilter;
    const matchesPlate = plateFilter === 'all' || violation.plateNumber === plateFilter;

    // Date range filter
    const violationDate = new Date(violation.date);
    const fromDate = dateFromFilter ? new Date(dateFromFilter) : null;
    const toDate = dateToFilter ? new Date(dateToFilter) : null;
    const matchesDateRange = (!fromDate || violationDate >= fromDate) && (!toDate || violationDate <= toDate);

    return matchesSearch && matchesStatus && matchesSeverity && matchesViolationType && matchesOwner && matchesPlate && matchesDateRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredViolations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedViolations = filteredViolations.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = () => {
    exportAllReports();
  };

  return (
    <MainLayout>
      <PageHeader
        title="Violations Management"
        description="Manage and track parking violations"
      >
        {isGuard && (
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Report Violation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Violation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plateNumber">License Plate Number</Label>
                    <Input
                      id="plateNumber"
                      placeholder="Enter plate number"
                      value={violationReport.plateNumber}
                      onChange={(e) => setViolationReport(prev => ({ ...prev, plateNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      placeholder="Enter owner name"
                      value={violationReport.ownerName}
                      onChange={(e) => setViolationReport(prev => ({ ...prev, ownerName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerType">Owner Type</Label>
                    <Select value={violationReport.ownerType} onValueChange={(value) => setViolationReport(prev => ({ ...prev, ownerType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                      <SelectItem value="non teaching personnel">Non Teaching Personnel</SelectItem>
                        <SelectItem value="Visitor">Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="violationType">Violation Type</Label>
                    <Select value={violationReport.violationType} onValueChange={(value) => setViolationReport(prev => ({ ...prev, violationType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Parking Violation">Parking Violation</SelectItem>
                        <SelectItem value="Unauthorized Parking">Unauthorized Parking</SelectItem>
                        <SelectItem value="Overstay">Overstay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={violationReport.severity} onValueChange={(value) => setViolationReport(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                      placeholder="Enter location"
                      value={violationReport.location}
                      onChange={(e) => setViolationReport(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the violation..."
                    value={violationReport.description}
                    onChange={(e) => setViolationReport(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReportViolation}>
                    Report Violation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {isAdmin && (
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        )}
      </PageHeader>

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Total Violations</p>
                  <p className="text-2xl font-bold">{violations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{violations.filter(v => v.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Resolved</p>
                  <p className="text-2xl font-bold">{violations.filter(v => v.status === 'resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">High Severity</p>
                  <p className="text-2xl font-bold">{violations.filter(v => v.severity === 'high').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search violations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={violationTypeFilter} onValueChange={setViolationTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Violation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Parking Violation">Parking Violation</SelectItem>
                  <SelectItem value="Unauthorized Parking">Unauthorized Parking</SelectItem>
                  <SelectItem value="Overstay">Overstay</SelectItem>
                </SelectContent>
              </Select>


              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Date From</Label>
                <Input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  className="w-[150px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Date To</Label>
                <Input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  className="w-[150px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Violations Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Violations List</CardTitle>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Items per page:</Label>
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
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>RFID Tag</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Offense Count</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedViolations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell className="font-mono font-semibold">{violation.id}</TableCell>
                    <TableCell className="font-mono">{violation.plateNumber}</TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {violation.rfidTag}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{violation.ownerName}</p>
                        <p className="text-sm text-muted-foreground">{violation.ownerType}</p>
                      </div>
                    </TableCell>
                    <TableCell>{violation.violationType}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(violation.status)}>
                        {violation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {violation.date}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {violation.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={violation.offenseCount > 1 ? 'destructive' : 'secondary'}>
                        {violation.offenseCount}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedViolation(violation)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review Details
                            </DropdownMenuItem>
                            {violation.status !== 'resolved' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleResolveViolation(violation.id, 'Resolved by Admin', 'Violation resolved')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Resolve
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <Gavel className="h-4 w-4 mr-2" />
                                    Apply Penalty
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleApplySpecificPenalty(violation, 'Warning')}>
                                      Warning
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleApplySpecificPenalty(violation, '1-Month Suspension')}>
                                      1-Month Suspension
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleApplySpecificPenalty(violation, '6-Month Suspension')}>
                                      6-Month Suspension
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleApplySpecificPenalty(violation, 'Permanent Deactivation')}>
                                      Permanent Deactivation
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredViolations.length)} of {filteredViolations.length} violations
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

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

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

        {/* Violation Details Dialog */}
        {selectedViolation && (
          <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Violation Details - {selectedViolation.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>License Plate</Label>
                    <p className="font-mono font-semibold text-lg">{selectedViolation.plateNumber}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedViolation.status)}>
                      {selectedViolation.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Owner Name</Label>
                    <p>{selectedViolation.ownerName}</p>
                  </div>
                  <div>
                    <Label>Owner Type</Label>
                    <p>{selectedViolation.ownerType}</p>
                  </div>
                  <div>
                    <Label>Violation Type</Label>
                    <p>{selectedViolation.violationType}</p>
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Badge className={getSeverityColor(selectedViolation.severity)}>
                      {selectedViolation.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedViolation.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <p>{selectedViolation.location}</p>
                  </div>
                  <div>
                    <Label>Reported By</Label>
                    <p>{selectedViolation.reportedBy}</p>
                  </div>
                  <div>
                    <Label>Reported At</Label>
                    <p>{selectedViolation.reportedAt}</p>
                  </div>
                  <div>
                    <Label>Evidence</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedViolation.evidence.map((evidence: string, index: number) => (
                        <Badge key={index} variant="outline">{evidence}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedViolation.resolution && (
                  <div className="border-t pt-4">
                    <Label className="text-lg font-semibold">Resolution</Label>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Action Taken</Label>
                          <p>{selectedViolation.resolution.action}</p>
                        </div>
                        <div>
                          <Label>Resolved By</Label>
                          <p>{selectedViolation.resolution.resolvedBy}</p>
                        </div>
                      </div>
                      <div>
                        <Label>Resolution Notes</Label>
                        <p className="mt-1 p-3 bg-green-50 rounded-md">{selectedViolation.resolution.notes}</p>
                      </div>
                      <div>
                        <Label>Resolved At</Label>
                        <p>{selectedViolation.resolution.resolvedAt}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedViolation.penalty && (
                  <div className="border-t pt-4">
                    <Label className="text-lg font-semibold">Penalty Applied</Label>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Penalty Type</Label>
                          <p className="font-semibold text-red-600">{selectedViolation.penalty.type}</p>
                        </div>
                        <div>
                          <Label>Applied By</Label>
                          <p>{selectedViolation.penalty.appliedBy}</p>
                        </div>
                      </div>
                      {selectedViolation.penalty.duration && (
                        <div>
                          <Label>Duration</Label>
                          <p>{selectedViolation.penalty.duration}</p>
                        </div>
                      )}
                      <div>
                        <Label>Penalty Notes</Label>
                        <p className="mt-1 p-3 bg-red-50 rounded-md">{selectedViolation.penalty.notes}</p>
                      </div>
                      <div>
                        <Label>Applied At</Label>
                        <p>{selectedViolation.penalty.appliedAt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Penalty Dialog */}
        {isPenaltyDialogOpen && selectedViolation && (
          <Dialog open={isPenaltyDialogOpen} onOpenChange={setIsPenaltyDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply Penalty - {selectedViolation.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>License Plate</Label>
                  <p className="font-mono font-semibold">{selectedViolation.plateNumber}</p>
                </div>
                <div>
                  <Label>Violation Type</Label>
                  <p>{selectedViolation.violationType}</p>
                </div>
                <div>
                  <Label>Penalty Notes</Label>
                  <Textarea
                    placeholder="Enter penalty notes..."
                    value={penaltyNotes}
                    onChange={(e) => setPenaltyNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsPenaltyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleApplyPenalty(selectedViolation)}>
                    Apply Penalty
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </MainLayout>
  );
};

export default Violations;
