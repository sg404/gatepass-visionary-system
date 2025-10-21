
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/utils/dateUtils';
import { AccessLog } from '@/types/accessLogs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
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

interface AccessLogsTableProps {
  logs: AccessLog[];
}

const AccessLogsTable: React.FC<AccessLogsTableProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'Guard' | 'Staff' | 'Visitor'>('all');
  const [filterAction, setFilterAction] = useState<'all' | 'Login' | 'Logout' | 'Issue Pass' | 'On Duty'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Function to get the badge color based on action type
  const getBadgeVariant = (action: string): "default" | "destructive" | "outline" | "secondary" => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'secondary';
    if (actionLower.includes('logout')) return 'destructive';
    if (actionLower.includes('issue')) return 'secondary';
    if (actionLower.includes('assigned') || actionLower.includes('on duty')) return 'secondary';
    return 'default';
  };

  const filteredLogs = logs
    .filter(log => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.site && log.site.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = filterRole === 'all' ||
        (filterRole === 'Guard' && log.role.includes('Guard')) ||
        (filterRole === 'Staff' && log.role.includes('Staff')) ||
        (filterRole === 'Visitor' && log.role.includes('Visitor'));

      const matchesAction = filterAction === 'all' || log.action.includes(filterAction);

      return matchesSearch && matchesRole && matchesAction;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

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
            placeholder="Search access logs..."
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
                Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setFilterRole('all')}
                className="flex items-center gap-2"
              >
                {filterRole === 'all' && <Check className="h-4 w-4" />}
                <span className={filterRole === 'all' ? 'font-medium' : ''}>All</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterRole('Guard')}
                className="flex items-center gap-2"
              >
                {filterRole === 'Guard' && <Check className="h-4 w-4" />}
                <span className={filterRole === 'Guard' ? 'font-medium' : ''}>Guard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterRole('Staff')}
                className="flex items-center gap-2"
              >
                {filterRole === 'Staff' && <Check className="h-4 w-4" />}
                <span className={filterRole === 'Staff' ? 'font-medium' : ''}>Staff</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterRole('Visitor')}
                className="flex items-center gap-2"
              >
                {filterRole === 'Visitor' && <Check className="h-4 w-4" />}
                <span className={filterRole === 'Visitor' ? 'font-medium' : ''}>Visitor</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Action
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setFilterAction('all')}
                className="flex items-center gap-2"
              >
                {filterAction === 'all' && <Check className="h-4 w-4" />}
                <span className={filterAction === 'all' ? 'font-medium' : ''}>All</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterAction('Login')}
                className="flex items-center gap-2"
              >
                {filterAction === 'Login' && <Check className="h-4 w-4" />}
                <span className={filterAction === 'Login' ? 'font-medium' : ''}>Login</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterAction('Logout')}
                className="flex items-center gap-2"
              >
                {filterAction === 'Logout' && <Check className="h-4 w-4" />}
                <span className={filterAction === 'Logout' ? 'font-medium' : ''}>Logout</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterAction('Issue Pass')}
                className="flex items-center gap-2"
              >
                {filterAction === 'Issue Pass' && <Check className="h-4 w-4" />}
                <span className={filterAction === 'Issue Pass' ? 'font-medium' : ''}>Issue Pass</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterAction('On Duty')}
                className="flex items-center gap-2"
              >
                {filterAction === 'On Duty' && <Check className="h-4 w-4" />}
                <span className={filterAction === 'On Duty' ? 'font-medium' : ''}>On Duty</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date & Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden lg:table-cell">Entry Gate (Old Site)</TableHead>
              <TableHead className="hidden lg:table-cell">Exit Gate (Old Site)</TableHead>
              <TableHead className="hidden md:table-cell">Duty Type</TableHead>
              <TableHead>Site</TableHead>
              <TableHead className="hidden md:table-cell">Temporary Pass</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No access logs found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {formatDateTime(log.dateTime)}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant={log.role.includes('Staff') ? 'outline' : 'secondary'}>
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                    {log.description}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {log.role === 'SEDMMO Staff' ? '-' : (log.entryGateOldSite || '-')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {log.role === 'SEDMMO Staff' ? '-' : (log.exitGateOldSite || '-')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {log.dutyType || '-'}
                  </TableCell>
                  <TableCell>{log.site || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {log.temporaryPassDetails || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
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

export default AccessLogsTable;
