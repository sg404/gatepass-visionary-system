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
  Search,
  Filter,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type VehicleStatus = 'active' | 'expired' | 'suspended';

type Vehicle = {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  ownerName: string;
  ownerType: 'student' | 'faculty';
  status: VehicleStatus;
  registeredDate: Date;
};

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: 'V-1001',
    licensePlate: 'ABC-123',
    make: 'Toyota',
    model: 'Camry',
    ownerName: 'David Natan Apruebo',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-01-15'),
  },
  {
    id: 'V-1002',
    licensePlate: 'DEF-456',
    make: 'Honda',
    model: 'Civic',
    ownerName: 'Emmilry Magic Cadesim',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-02-20'),
  },
  {
    id: 'V-1003',
    licensePlate: 'GHI-789',
    make: 'Ford',
    model: 'Focus',
    ownerName: 'Shekinah Gayonoche',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2022-05-10'),
  },
  {
    id: 'V-1004',
    licensePlate: 'JKL-012',
    make: 'Chevrolet',
    model: 'Malibu',
    ownerName: 'Aerella Lou Nicor',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-03-05'),
  },
  {
    id: 'V-1005',
    licensePlate: 'MNO-345',
    make: 'Hyundai',
    model: 'Elantra',
    ownerName: 'Christian Porras',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-01-30'),
  },
  {
    id: 'V-1006',
    licensePlate: 'PQR-678',
    make: 'Toyota',
    model: 'Corolla',
    ownerName: 'Angielou Sujede',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-04-15'),
  },
  {
    id: 'V-1007',
    licensePlate: 'STU-901',
    make: 'Honda',
    model: 'Accord',
    ownerName: 'Victor Jom Sorita',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-05-01'),
  },
  {
    id: 'V-1008',
    licensePlate: 'VWX-234',
    make: 'Ford',
    model: 'Mustang',
    ownerName: 'Hannah Planco',
    ownerType: 'student',
    status: 'active',
    registeredDate: new Date('2023-05-20'),
  },
  {
    id: 'V-1009',
    licensePlate: 'YZA-567',
    make: 'Toyota',
    model: 'Fortuner',
    ownerName: 'Reynaldo Ilangos',
    ownerType: 'faculty',
    status: 'active',
    registeredDate: new Date('2023-01-10'),
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
  const [filterType, setFilterType] = useState<'all' | 'student' | 'faculty'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | VehicleStatus>('all');
  const [sortField, setSortField] = useState<keyof Vehicle>('registeredDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

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
                onClick={() => setFilterType('faculty')}
                className="flex items-center gap-2"
              >
                {filterType === 'faculty' && <Check className="h-4 w-4" />}
                <span className={filterType === 'faculty' ? 'font-medium' : ''}>Faculty</span>
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
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.ownerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vehicle.ownerType === 'student' ? 'Student' : 'Faculty'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredVehicles.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} entries
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
