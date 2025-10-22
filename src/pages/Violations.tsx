import React, { useState } from 'react';
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
import { AlertTriangle, FileText, Plus, Search, Filter, Eye, CheckCircle, XCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportAllReports } from '@/utils/reportGenerator';

const Violations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);

  // Check if user is a guard (only guards can report violations)
  const guardSession = localStorage.getItem('guardSession');
  const isGuard = !!guardSession;
  const isAdmin = !isGuard;

  // Mock violations data
  const [violations, setViolations] = useState([
    {
      id: 'V003',
      plateNumber: 'ABC1234',
      ownerName: 'Jane Student',
      ownerType: 'Student',
      violationType: 'Parking Violation',
      description: 'Parked in faculty-only zone',
      severity: 'low',
      status: 'resolved',
      reportedBy: 'Security Patrol',
      reportedAt: '2025-01-17 16:45',
      location: 'Faculty Parking Zone A',
      evidence: ['violation_photo.jpg'],
      resolution: {
        action: 'Warning Issued',
        resolvedBy: 'Security Officer - Charlie',
        resolvedAt: '2025-01-17 17:00',
        notes: 'Student was unaware of parking rules. Verbal warning given.'
      }
    },
    {
      id: 'V004',
      plateNumber: 'DEF5678',
      ownerName: 'Dr. Smith',
      ownerType: 'Faculty',
      violationType: 'Speeding',
      description: 'Exceeded speed limit in campus area (45 km/h detected)',
      severity: 'high',
      status: 'escalated',
      reportedBy: 'Speed Camera System',
      reportedAt: '2025-01-18 11:20',
      location: 'Main Campus Road',
      evidence: ['speed_camera.jpg', 'speed_log.txt'],
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
    const newViolation = {
      id: `V${String(violations.length + 1).padStart(3, '0')}`,
      plateNumber: violationReport.plateNumber,
      ownerName: violationReport.ownerName,
      ownerType: violationReport.ownerType,
      violationType: violationReport.violationType,
      description: violationReport.description,
      severity: violationReport.severity,
      status: 'pending',
      reportedBy: 'Current Guard', // In real app, get from session
      reportedAt: new Date().toLocaleString(),
      location: violationReport.location,
      evidence: violationReport.evidence,
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

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.violationType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

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
        <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
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
            </div>
          </CardContent>
        </Card>

        {/* Violations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Violations List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredViolations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell className="font-mono font-semibold">{violation.id}</TableCell>
                    <TableCell className="font-mono">{violation.plateNumber}</TableCell>
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
                      <p>{violation.reportedAt}</p>
                      <p className="text-muted-foreground">{violation.reportedBy}</p>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedViolation(violation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {violation.status !== 'resolved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveViolation(violation.id, 'Warning Issued', 'Resolved by guard')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default Violations;
