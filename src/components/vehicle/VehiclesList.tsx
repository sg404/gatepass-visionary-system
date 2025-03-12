
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  Trash, 
  Search, 
  Filter,
  ArrowUpDown,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type VehicleStatus = 'active' | 'expired' | 'suspended';

type Vehicle = {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  ownerName: string;
  ownerType: 'student' | 'staff';
  status: VehicleStatus;
  registeredDate: Date;
  expiryDate: Date;
  lastEntry?: Date;
  lastExit?: Date;
};

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: 'V-1001',
    licensePlate: 'ABC-123',
    make: 'Toyota',
    model: 'Camry',
    ownerName: 'John Smith',
    ownerType: 'staff',
    status: 'active',
    registeredDate: new Date('2023-01-15'),
    expiryDate: new Date('2024-01-15'),
    lastEntry: new Date('2023-06-10T08:30:00'),
    lastExit: new Date('2023-06-10T17:15:00'),
  },
  {
    id: 'V-1002',
    licensePlate: 'DEF-456',
    make: 'Honda',
    model: 'Civic',
    ownerName: 'Emma Johnson',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-02-20'),
    expiryDate: new Date('2024-02-20'),
    lastEntry: new Date('2023-06-09T09:15:00'),
    lastExit: new Date('2023-06-09T16:30:00'),
  },
  {
    id: 'V-1003',
    licensePlate: 'GHI-789',
    make: 'Ford',
    model: 'Focus',
    ownerName: 'Michael Brown',
    ownerType: 'staff',
    status: 'expired',
    registeredDate: new Date('2022-05-10'),
    expiryDate: new Date('2023-05-10'),
    lastEntry: new Date('2023-05-08T07:45:00'),
    lastExit: new Date('2023-05-08T18:00:00'),
  },
  {
    id: 'V-1004',
    licensePlate: 'JKL-012',
    make: 'Chevrolet',
    model: 'Malibu',
    ownerName: 'Sophia Davis',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-03-05'),
    expiryDate: new Date('2024-03-05'),
    lastEntry: new Date('2023-06-10T10:00:00'),
    lastExit: new Date('2023-06-10T15:45:00'),
  },
  {
    id: 'V-1005',
    licensePlate: 'MNO-345',
    make: 'Hyundai',
    model: 'Elantra',
    ownerName: 'Daniel Wilson',
    ownerType: 'student',
    status: 'suspended',
    registeredDate: new Date('2023-01-30'),
    expiryDate: new Date('2024-01-30'),
    lastEntry: new Date('2023-05-15T08:15:00'),
    lastExit: new Date('2023-05-15T14:30:00'),
  },
];

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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

const getStatusBadgeVariant = (status: VehicleStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'expired':
      return 'secondary';
    case 'suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

const VehiclesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'staff'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | VehicleStatus>('all');
  const [sortField, setSortField] = useState<keyof Vehicle>('registeredDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredVehicles = mockVehicles
    .filter(vehicle => {
      const matchesSearch = 
        vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || vehicle.ownerType === filterType;
      const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="search" 
            placeholder="Search vehicles..." 
            className="h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Owner Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setFilterType('all')}
                className="flex items-center gap-2"
              >
                {filterType === 'all' && <Check className="h-4 w-4" />}
                <span className={filterType === 'all' ? 'font-medium' : ''}>All</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterType('student')}
                className="flex items-center gap-2"
              >
                {filterType === 'student' && <Check className="h-4 w-4" />}
                <span className={filterType === 'student' ? 'font-medium' : ''}>Student</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterType('staff')}
                className="flex items-center gap-2"
              >
                {filterType === 'staff' && <Check className="h-4 w-4" />}
                <span className={filterType === 'staff' ? 'font-medium' : ''}>Staff</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
                onClick={() => setFilterStatus('expired')}
                className="flex items-center gap-2"
              >
                {filterStatus === 'expired' && <Check className="h-4 w-4" />}
                <span className={filterStatus === 'expired' ? 'font-medium' : ''}>Expired</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterStatus('suspended')}
                className="flex items-center gap-2"
              >
                {filterStatus === 'suspended' && <Check className="h-4 w-4" />}
                <span className={filterStatus === 'suspended' ? 'font-medium' : ''}>Suspended</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="default">Register Vehicle</Button>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                  ID
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('licensePlate')}>
                  License Plate
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('ownerName')}>
                  Owner
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                  Status
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('expiryDate')}>
                  Expiry
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="scale-in-center" style={{ 
                  animationDelay: `${filteredVehicles.indexOf(vehicle) * 0.05}s`,
                  animationFillMode: 'both' 
                }}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.ownerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vehicle.ownerType === 'student' ? 'Student' : 'Staff'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(vehicle.expiryDate)}</TableCell>
                  <TableCell>
                    {vehicle.lastEntry && vehicle.lastExit ? (
                      <div className="text-xs">
                        <div className="flex items-center text-muted-foreground">
                          <span className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></span>
                          In: {formatDateTime(vehicle.lastEntry)}
                        </div>
                        <div className="flex items-center text-muted-foreground mt-1">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mr-1.5"></span>
                          Out: {formatDateTime(vehicle.lastExit)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No recent activity</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VehiclesList;
