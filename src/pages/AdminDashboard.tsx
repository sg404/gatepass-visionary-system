import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Car, Shield, FileText, TrendingUp, AlertTriangle, Eye, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockRegistrations, RegistrationApplication } from '@/data/mockRegistrations';

const ApplicationDetailsModal = ({ registration }: { registration: RegistrationApplication }) => {
  return (
    <div className="space-y-6">
      {/* User Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <p className="text-sm text-muted-foreground">{registration.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{registration.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <p className="text-sm text-muted-foreground">{registration.contact}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <p className="text-sm text-muted-foreground">
              {registration.role === 'student' ? 'Student' :
               registration.role === 'faculty' ? 'Faculty' : 'Non-Teaching'}
            </p>
          </div>
          {registration.role === 'student' && (
            <>
              <div>
                <label className="text-sm font-medium">Course</label>
                <p className="text-sm text-muted-foreground">{registration.course}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Year & Section</label>
                <p className="text-sm text-muted-foreground">{registration.year} - {registration.section}</p>
              </div>
            </>
          )}
          {registration.role === 'faculty' && (
            <div>
              <label className="text-sm font-medium">Employment Type</label>
              <p className="text-sm text-muted-foreground">{registration.employmentType}</p>
            </div>
          )}
          {registration.role === 'non-teaching' && (
            <div>
              <label className="text-sm font-medium">Employment Type</label>
              <p className="text-sm text-muted-foreground">{registration.employmentType}</p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Vehicle Type</label>
            <p className="text-sm text-muted-foreground">{registration.vehicleType}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Manufacturer</label>
            <p className="text-sm text-muted-foreground">{registration.manufacturer}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Model</label>
            <p className="text-sm text-muted-foreground">{registration.model}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <p className="text-sm text-muted-foreground">{registration.color}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Plate Number</label>
            <p className="text-sm text-muted-foreground">{registration.plateNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Fuel Type</label>
            <p className="text-sm text-muted-foreground">{registration.fuelType}</p>
          </div>
          {registration.vehicleType === 'motorcycle' && (
            <div>
              <label className="text-sm font-medium">Cubic Capacity</label>
              <p className="text-sm text-muted-foreground">{registration.cubicCapacity} cc</p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Driver's License</label>
            <img
              src={registration.documents.driverLicense}
              alt="Driver's License"
              className="w-full h-32 object-cover rounded border mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Official Receipt (OR)</label>
            <img
              src={registration.documents.officialReceipt}
              alt="Official Receipt"
              className="w-full h-32 object-cover rounded border mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Certificate of Registration (CR)</label>
            <img
              src={registration.documents.certificateOfRegistration}
              alt="Certificate of Registration"
              className="w-full h-32 object-cover rounded border mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RejectionModal = ({ registrationId }: { registrationId: string }) => {
  const [reason, setReason] = useState('');

  const handleReject = () => {
    // Mock rejection logic
    alert(`Application rejected. Reason: ${reason}`);
    // In real app, this would update the registration status and send email
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="reason" className="text-sm font-medium">Reason for Rejection</label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for rejecting this application..."
          className="mt-2"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive" onClick={handleReject}>Reject Application</Button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleApprove = (id: string) => {
    // Mock approval logic
    const registrationCode = 'REG-' + Date.now();
    alert(`Application approved. The vehicle owner will receive an email with their unique registration code: ${registrationCode}. Please remind them to present this code along with their documents for final verification at the SSEDMMO office.`);
    // In real app, this would update the registration status and send email
  };

  const stats = [
    {
      title: 'Total Vehicles',
      value: '1,234',
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/vehicles'
    },
    {
      title: 'Active Visitors',
      value: '89',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/visitors'
    },
    {
      title: 'Security Alerts',
      value: '12',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/security'
    },
    {
      title: 'Reports Generated',
      value: '45',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/reports'
    }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of Smart Vehicle Gate Pass System"
      />

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(stat.path)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vehicle Registration Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Registration Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{registration.fullName}</div>
                        <div className="text-sm text-muted-foreground">{registration.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {registration.role === 'student' ? 'Student' :
                         registration.role === 'faculty' ? 'Faculty' : 'Non-Teaching'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{registration.vehicleType}</div>
                        <div className="text-sm text-muted-foreground">
                          {registration.manufacturer} {registration.model}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{registration.plateNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          registration.status === 'approved' ? 'default' :
                          registration.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(registration.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                            </DialogHeader>
                            <ApplicationDetailsModal registration={registration} />
                          </DialogContent>
                        </Dialog>
                        {registration.status === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(registration.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Application</DialogTitle>
                                </DialogHeader>
                                <RejectionModal registrationId={registration.id} />
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/vehicles')}>
                <Car className="h-6 w-6" />
                Manage Vehicles
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/visitors')}>
                <Users className="h-6 w-6" />
                Visitor Management
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/violations')}>
                <AlertTriangle className="h-6 w-6" />
                View Violations
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/access-logs')}>
                <TrendingUp className="h-6 w-6" />
                Access Logs
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/reports')}>
                <FileText className="h-6 w-6" />
                Generate Reports
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/settings')}>
                <Shield className="h-6 w-6" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
