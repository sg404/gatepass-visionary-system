import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Radio,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  CreditCard,
  RefreshCw,
  Calendar,
  Car,
  User,
  Tag,
  Search
} from 'lucide-react';

interface RFIDIncident {
  id: string;
  vehicleOwner: string;
  plateNumber: string;
  rfidTagNumber: string;
  incidentType: 'Lost' | 'Damaged' | 'Unreadable' | 'Expired';
  description: string;
  dateReported: string;
  paymentStatus: 'Pending Payment' | 'Paid' | 'Replaced';
  offenseCount: number;
}

interface PendingVerification {
  id: string;
  vehicleOwner: string;
  plateNumber: string;
  vehicleType: string;
  applicationDate: string;
  status: 'Awaiting Document Verification' | 'Awaiting RFID Issuance';
}

interface RFIDRecord {
  id: string;
  vehicleOwner: string;
  numberOfVehicles: number;
  vehicleType: string;
  plateNumber: string;
  rfidTagId: string;
  issuedDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

const RFIDManagement = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<RFIDIncident | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingSearch, setPendingSearch] = useState('');
  const [recordsSearch, setRecordsSearch] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    vehicleOwner: '',
    plateNumber: '',
    rfidTagNumber: '',
    incidentType: '',
    description: '',
    paymentStatus: 'Pending Payment'
  });

  // Mock data for RFID incidents
  const [incidents, setIncidents] = useState<RFIDIncident[]>([
    {
      id: '1',
      vehicleOwner: 'John Doe',
      plateNumber: 'ABC1234',
      rfidTagNumber: 'RFID001234',
      incidentType: 'Lost',
      description: 'Tag reported lost during parking',
      dateReported: '2024-01-15',
      paymentStatus: 'Pending Payment',
      offenseCount: 1
    },
    {
      id: '2',
      vehicleOwner: 'Jane Smith',
      plateNumber: 'XYZ9876',
      rfidTagNumber: 'RFID005678',
      incidentType: 'Damaged',
      description: 'Tag damaged by vehicle accident',
      dateReported: '2024-01-10',
      paymentStatus: 'Paid',
      offenseCount: 2
    },
    {
      id: '3',
      vehicleOwner: 'Bob Johnson',
      plateNumber: 'DEF5678',
      rfidTagNumber: 'RFID009876',
      incidentType: 'Expired',
      description: 'Tag expired and needs renewal',
      dateReported: '2024-01-08',
      paymentStatus: 'Replaced',
      offenseCount: 1
    }
  ]);

  // Mock data for pending RFID verification
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([
    {
      id: '1',
      vehicleOwner: 'Alice Cooper',
      plateNumber: 'GHI9012',
      vehicleType: 'Sedan',
      applicationDate: '2024-01-20',
      status: 'Awaiting Document Verification'
    },
    {
      id: '2',
      vehicleOwner: 'Charlie Brown',
      plateNumber: 'JKL3456',
      vehicleType: 'SUV',
      applicationDate: '2024-01-18',
      status: 'Awaiting RFID Issuance'
    },
    {
      id: '3',
      vehicleOwner: 'Diana Prince',
      plateNumber: 'MNO7890',
      vehicleType: 'Hatchback',
      applicationDate: '2024-01-16',
      status: 'Awaiting Document Verification'
    }
  ]);

  // Mock data for RFID records
  const [rfidRecords, setRfidRecords] = useState<RFIDRecord[]>([
    {
      id: '1',
      vehicleOwner: 'John Doe',
      numberOfVehicles: 2,
      vehicleType: 'Sedan',
      plateNumber: 'ABC1234',
      rfidTagId: 'RFID001234',
      issuedDate: '2024-01-01',
      status: 'Active'
    },
    {
      id: '2',
      vehicleOwner: 'Jane Smith',
      numberOfVehicles: 1,
      vehicleType: 'SUV',
      plateNumber: 'XYZ9876',
      rfidTagId: 'RFID005678',
      issuedDate: '2024-01-05',
      status: 'Active'
    },
    {
      id: '3',
      vehicleOwner: 'Bob Johnson',
      numberOfVehicles: 3,
      vehicleType: 'Truck',
      plateNumber: 'DEF5678',
      rfidTagId: 'RFID009876',
      issuedDate: '2024-01-03',
      status: 'Suspended'
    }
  ]);

  // Mock data for RFID expiration tracker
  const expirationStats = {
    active: 245,
    nearExpiry: 12,
    expired: 3
  };

  // Calculate summary stats
  const pendingRFIDCount = pendingVerifications.length;
  const totalApprovedCount = rfidRecords.filter(record => record.status === 'Active').length;

  const handleFormSubmit = () => {
    if (!formData.vehicleOwner || !formData.plateNumber || !formData.incidentType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newIncident: RFIDIncident = {
      id: isEditMode && selectedIncident ? selectedIncident.id : Date.now().toString(),
      vehicleOwner: formData.vehicleOwner,
      plateNumber: formData.plateNumber,
      rfidTagNumber: formData.rfidTagNumber,
      incidentType: formData.incidentType as RFIDIncident['incidentType'],
      description: formData.description,
      dateReported: isEditMode && selectedIncident ? selectedIncident.dateReported : new Date().toISOString().split('T')[0],
      paymentStatus: formData.paymentStatus as RFIDIncident['paymentStatus'],
      offenseCount: isEditMode && selectedIncident ? selectedIncident.offenseCount : 1
    };

    if (isEditMode && selectedIncident) {
      setIncidents(prev => prev.map(incident =>
        incident.id === selectedIncident.id ? newIncident : incident
      ));
      toast({
        title: "Success",
        description: "RFID incident report updated successfully."
      });
    } else {
      setIncidents(prev => [...prev, newIncident]);
      toast({
        title: "Success",
        description: "New RFID incident report added successfully."
      });
    }

    // Reset form
    setFormData({
      vehicleOwner: '',
      plateNumber: '',
      rfidTagNumber: '',
      incidentType: '',
      description: '',
      paymentStatus: 'Pending Payment'
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedIncident(null);
  };

  const handleEdit = (incident: RFIDIncident) => {
    setSelectedIncident(incident);
    setFormData({
      vehicleOwner: incident.vehicleOwner,
      plateNumber: incident.plateNumber,
      rfidTagNumber: incident.rfidTagNumber,
      incidentType: incident.incidentType,
      description: incident.description,
      paymentStatus: incident.paymentStatus
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleMarkAsPaid = (incident: RFIDIncident) => {
    setIncidents(prev => prev.map(item =>
      item.id === incident.id ? { ...item, paymentStatus: 'Paid' as const } : item
    ));
    toast({
      title: "Payment Status Updated",
      description: `Payment for ${incident.vehicleOwner}'s incident has been marked as paid.`
    });
  };

  const handleIssueReplacement = (incident: RFIDIncident) => {
    if (incident.paymentStatus !== 'Paid') {
      toast({
        title: "Payment Required",
        description: "Cannot issue new RFID tag until payment is completed.",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog
    if (window.confirm(`Confirm RFID replacement issuance for ${incident.vehicleOwner}?`)) {
      setIncidents(prev => prev.map(item =>
        item.id === incident.id ? { ...item, paymentStatus: 'Replaced' as const } : item
      ));
      toast({
        title: "RFID Tag Replaced",
        description: "RFID tag has been replaced successfully.",
        variant: "default"
      });
    }
  };

  const getOffenseBadgeVariant = (count: number) => {
    if (count === 1) return 'secondary';
    if (count === 2) return 'outline';
    return 'destructive';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600';
      case 'Replaced': return 'text-blue-600';
      default: return 'text-red-600';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  // Filter functions
  const filteredPending = pendingVerifications.filter(item =>
    item.vehicleOwner.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    item.plateNumber.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    item.vehicleType.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  const filteredRecords = rfidRecords.filter(item =>
    item.vehicleOwner.toLowerCase().includes(recordsSearch.toLowerCase()) ||
    item.plateNumber.toLowerCase().includes(recordsSearch.toLowerCase()) ||
    item.vehicleType.toLowerCase().includes(recordsSearch.toLowerCase()) ||
    item.rfidTagId.toLowerCase().includes(recordsSearch.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="RFID Management"
        description="Manage RFID tags, track incidents, and monitor system status"
      >
        <Button variant="outline" size="sm" className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>

      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending RFID</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingRFIDCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting physical verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalApprovedCount}</div>
              <p className="text-xs text-muted-foreground">Fully registered vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active RFID Tags</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{expirationStats.active}</div>
              <p className="text-xs text-muted-foreground">Currently valid tags</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{expirationStats.nearExpiry}</div>
              <p className="text-xs text-muted-foreground">Expiring within 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Physical Verification Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Physical Verification
                </CardTitle>
                <CardDescription>
                  Approved applications awaiting document verification and RFID tag issuance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by owner, plate, or vehicle type..."
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Owner</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPending.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.vehicleOwner}</TableCell>
                      <TableCell>{item.plateNumber}</TableCell>
                      <TableCell>{item.vehicleType}</TableCell>
                      <TableCell>{item.applicationDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* RFID Records Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  RFID Records
                </CardTitle>
                <CardDescription>
                  Vehicles with issued RFID tags and complete registration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by owner, plate, type, or RFID ID..."
                  value={recordsSearch}
                  onChange={(e) => setRecordsSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Owner</TableHead>
                    <TableHead>No. of Vehicles</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>RFID Tag ID</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.vehicleOwner}</TableCell>
                      <TableCell>{record.numberOfVehicles}</TableCell>
                      <TableCell>{record.vehicleType}</TableCell>
                      <TableCell>{record.plateNumber}</TableCell>
                      <TableCell className="font-mono text-sm">{record.rfidTagId}</TableCell>
                      <TableCell>{record.issuedDate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* RFID Tag Incident Report Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  RFID Tag Incident Report and Tracking
                </CardTitle>
                <CardDescription>
                  Record and track RFID tag issues, manage replacements, and monitor payment status
                </CardDescription>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setIsEditMode(false);
                    setSelectedIncident(null);
                    setFormData({
                      vehicleOwner: '',
                      plateNumber: '',
                      rfidTagNumber: '',
                      incidentType: '',
                      description: '',
                      paymentStatus: 'Pending Payment'
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New RFID Tag Incident Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? 'Edit RFID Incident Report' : 'New RFID Tag Incident Report'}
                    </DialogTitle>
                    <DialogDescription>
                      Record details of RFID tag incidents for tracking and replacement management.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleOwner">Vehicle Owner Name *</Label>
                        <Input
                          id="vehicleOwner"
                          value={formData.vehicleOwner}
                          onChange={(e) => setFormData(prev => ({ ...prev, vehicleOwner: e.target.value }))}
                          placeholder="Enter owner name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plateNumber">Vehicle Plate Number *</Label>
                        <Input
                          id="plateNumber"
                          value={formData.plateNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
                          placeholder="ABC1234"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rfidTagNumber">RFID Tag Number</Label>
                        <Input
                          id="rfidTagNumber"
                          value={formData.rfidTagNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, rfidTagNumber: e.target.value }))}
                          placeholder="RFID001234"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incidentType">Incident Type *</Label>
                        <Select value={formData.incidentType} onValueChange={(value) => setFormData(prev => ({ ...prev, incidentType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lost">Lost</SelectItem>
                            <SelectItem value="Damaged">Damaged</SelectItem>
                            <SelectItem value="Unreadable">Unreadable</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description / Remarks</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the incident..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select value={formData.paymentStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentStatus: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Replaced">Replaced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(formData.incidentType === 'Lost' || formData.incidentType === 'Damaged') && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Please instruct the vehicle owner to settle the RFID replacement fee at the cashier before issuing a new tag.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleFormSubmit}>
                      {isEditMode ? 'Update Report' : 'Add Report'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Owner</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>RFID Tag</TableHead>
                    <TableHead>Incident Type</TableHead>
                    <TableHead>Offense Count</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.vehicleOwner}</TableCell>
                      <TableCell>{incident.plateNumber}</TableCell>
                      <TableCell className="font-mono text-sm">{incident.rfidTagNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{incident.incidentType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOffenseBadgeVariant(incident.offenseCount)}>
                          {incident.offenseCount}{incident.offenseCount === 1 ? 'st' : incident.offenseCount === 2 ? 'nd' : 'rd'} Offense
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getPaymentStatusColor(incident.paymentStatus)}`}>
                          {incident.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>{incident.dateReported}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(incident)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {incident.paymentStatus === 'Pending Payment' && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsPaid(incident)}>
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleIssueReplacement(incident)}
                            disabled={incident.paymentStatus !== 'Paid'}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RFIDManagement;
