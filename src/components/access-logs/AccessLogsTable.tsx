
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell
} from '@/components/ui/table';
import { formatDateTime } from '@/utils/dateUtils';
import { AccessLog } from '@/types/accessLogs';
import { Badge } from '@/components/ui/badge';

interface AccessLogsTableProps {
  logs: AccessLog[];
}

const AccessLogsTable: React.FC<AccessLogsTableProps> = ({ logs }) => {
  // Function to get the badge color based on action type
  const getBadgeVariant = (action: string): "default" | "destructive" | "outline" | "secondary" => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'secondary';
    if (actionLower.includes('logout')) return 'destructive';
    if (actionLower.includes('issue')) return 'secondary';
    if (actionLower.includes('assigned') || actionLower.includes('on duty')) return 'secondary';
    return 'default';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Date & Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden lg:table-cell">Entry Gate (Old)</TableHead>
            <TableHead className="hidden lg:table-cell">Exit Gate (Old)</TableHead>
            <TableHead className="hidden lg:table-cell">Entry Gate (New)</TableHead>
            <TableHead className="hidden lg:table-cell">Exit Gate (New)</TableHead>
            <TableHead className="hidden md:table-cell">Duty Type</TableHead>
            <TableHead>Site</TableHead>
            <TableHead className="hidden md:table-cell">Temporary Pass</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
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
                {log.entryGateOldSite || '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {log.exitGateOldSite || '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {log.entryGateNewSite || '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {log.exitGateNewSite || '-'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {log.dutyType || '-'}
              </TableCell>
              <TableCell>{log.site || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">
                {log.temporaryPassDetails || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccessLogsTable;
