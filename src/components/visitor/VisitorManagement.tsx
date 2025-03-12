
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  UserPlus, 
  Clock, 
  ArrowUpDown, 
  Filter, 
  EyeOff, 
  ExternalLink,
  Check,
  X,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type VisitorStatus = 'active' | 'checked-out' | 'expired';

type Visitor = {
  id: string;
  name: string;
  licensePlate: string;
  purpose: string;
  contactPerson: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: VisitorStatus;
  duration: string;
};

// Mock data
const mockVisitors: Visitor[] = [
  {
    id: 'VP-1001',
    name: 'Alex Johnson',
    licensePlate: 'ABC-123',
    purpose: 'Meeting with Professor',
    contactPerson: 'Dr. Williams',
    checkInTime: new Date(new Date().getTime() - 1000 * 60 * 30), // 30 minutes ago
    status: 'active',
    duration: '2 hours',
  },
  {
    id: 'VP-1002',
    name: 'Sarah Miller',
    licensePlate: 'DEF-456',
    purpose: 'Contractor Work',
    contactPerson: 'Maintenance Dept.',
    checkInTime: new Date(new Date().getTime() - 1000 * 60 * 120), // 2 hours ago
    status: 'active',
    duration: '8 hours',
  },
  {
    id: 'VP-1003',
    name: 'Robert Davis',
    licensePlate: 'GHI-789',
    purpose: 'Student Registration',
    contactPerson: 'Admissions Office',
    checkInTime: new Date(new Date().getTime() - 1000 * 60 * 240), // 4 hours ago
    checkOutTime: new Date(new Date().getTime() - 1000 * 60 * 180), // 3 hours ago
    status: 'checked-out',
    duration: '1 hour',
  },
  {
    id: 'VP-1004',
    name: 'Emily Wilson',
    licensePlate: 'JKL-012',
    purpose: 'Parent Visit',
    contactPerson: 'Student Affairs',
    checkInTime: new Date(new Date().getTime() - 1000 * 60 * 300), // 5 hours ago
    checkOutTime: new Date(new Date().getTime() - 1000 * 60 * 240), // 4 hours ago
    status: 'checked-out',
    duration: '1 hour',
  },
  {
    id: 'VP-1005',
    name: 'Michael Brown',
    licensePlate: 'MNO-345',
    purpose: 'Delivery',
    contactPerson: 'Logistics Dept.',
    checkInTime: new Date(new Date().getTime() - 1000 * 60 * 90), // 1.5 hours ago
    status: 'active',
    duration: '30 minutes',
  },
];

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getStatusBadgeVariant = (status: VisitorStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'checked-out':
      return 'secondary';
    case 'expired':
      return 'destructive';
    default:
      return 'outline';
  }
};

const VisitorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | VisitorStatus>('all');
  const [selectedTab, setSelectedTab] = useState('active');
  const [sortField, setSortField] = useState<keyof Visitor>('checkInTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isNewVisitorOpen, setIsNewVisitorOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    licensePlate: '',
    purpose: '',
    contactPerson: '',
    duration: '',
  });

  const handleSort = (field: keyof Visitor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddVisitor = () => {
    // Handle adding visitor logic
    setIsNewVisitorOpen(false);
    // Reset form
    setNewVisitor({
      name: '',
      licensePlate: '',
      purpose: '',
      contactPerson: '',
      duration: '',
    });
  };

  const filteredVisitors = mockVisitors
    .filter(visitor => {
      const matchesTab = 
        (selectedTab === 'active' && visitor.status === 'active') ||
        (selectedTab === 'checked-out' && visitor.status === 'checked-out') ||
        selectedTab === 'all';
      
      const matchesSearch = 
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || visitor.status === filterStatus;
      
      return matchesSearch && matchesStatus && matchesTab;
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Active Visitors</CardTitle>
            <CardDescription>Currently on premises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockVisitors.filter(v => v.status === 'active').length}
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" className="h-8 px-2 text-xs">
                View All
              </Button>
              <span className="text-xs text-muted-foreground">Updated just now</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Today's Visitors</CardTitle>
            <CardDescription>Total for the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-green-600 font-medium">
                +3 from yesterday
              </div>
              <span className="text-xs text-muted-foreground">June 10, 2023</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Average Visit Duration</CardTitle>
            <CardDescription>Time spent on campus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.5 hrs</div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-amber-600 font-medium">
                -15 min from last week
              </div>
              <span className="text-xs text-muted-foreground">Past 7 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs defaultValue="active" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isNewVisitorOpen} onOpenChange={setIsNewVisitorOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Visitor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Register New Visitor</DialogTitle>
                  <DialogDescription>
                    Enter the visitor's information to issue a temporary pass.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={newVisitor.name}
                      onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="license" className="text-right">
                      License Plate
                    </Label>
                    <Input
                      id="license"
                      value={newVisitor.licensePlate}
                      onChange={(e) => setNewVisitor({...newVisitor, licensePlate: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">
                      Purpose
                    </Label>
                    <Input
                      id="purpose"
                      value={newVisitor.purpose}
                      onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Contact Person
                    </Label>
                    <Input
                      id="contact"
                      value={newVisitor.contactPerson}
                      onChange={(e) => setNewVisitor({...newVisitor, contactPerson: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Est. Duration
                    </Label>
                    <Input
                      id="duration"
                      placeholder="e.g. 2 hours"
                      value={newVisitor.duration}
                      onChange={(e) => setNewVisitor({...newVisitor, duration: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsNewVisitorOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddVisitor}>Issue Pass</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="search" 
              placeholder="Search visitors..." 
              className="h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setFilterStatus('all')}
                  className="flex items-center gap-2"
                >
                  {filterStatus === 'all' && <Check className="h-4 w-4" />}
                  <span className={filterStatus === 'all' ? 'font-medium' : ''}>All</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterStatus('active')}
                  className="flex items-center gap-2"
                >
                  {filterStatus === 'active' && <Check className="h-4 w-4" />}
                  <span className={filterStatus === 'active' ? 'font-medium' : ''}>Active</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterStatus('checked-out')}
                  className="flex items-center gap-2"
                >
                  {filterStatus === 'checked-out' && <Check className="h-4 w-4" />}
                  <span className={filterStatus === 'checked-out' ? 'font-medium' : ''}>Checked Out</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterStatus('expired')}
                  className="flex items-center gap-2"
                >
                  {filterStatus === 'expired' && <Check className="h-4 w-4" />}
                  <span className={filterStatus === 'expired' ? 'font-medium' : ''}>Expired</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                    Pass ID
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                    Visitor
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('checkInTime')}>
                    Check In
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No visitors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id} className="scale-in-center" style={{ 
                    animationDelay: `${filteredVisitors.indexOf(visitor) * 0.05}s`,
                    animationFillMode: 'both' 
                  }}>
                    <TableCell className="font-medium">{visitor.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        {visitor.name}
                      </div>
                    </TableCell>
                    <TableCell>{visitor.licensePlate}</TableCell>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.contactPerson}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatTime(visitor.checkInTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {visitor.checkOutTime ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatTime(visitor.checkOutTime)}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(visitor.status)}>
                        {visitor.status === 'checked-out' ? 'Checked Out' : 
                         visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {visitor.status === 'active' ? (
                          <Button variant="outline" size="sm" className="h-8">
                            Check Out
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VisitorManagement;
