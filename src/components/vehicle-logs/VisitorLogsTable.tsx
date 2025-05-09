
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell
} from '@/components/ui/table';
import { VisitorEntryLog } from '@/types/vehicleEntryLogs';
import { Badge } from '@/components/ui/badge';

interface VisitorLogsTableProps {
  logs: VisitorEntryLog[];
}

const VisitorLogsTable: React.FC<VisitorLogsTableProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Plate Number</TableHead>
            <TableHead>Purpose of Visit</TableHead>
            <TableHead>Temporary Pass ID</TableHead>
            <TableHead>Entry Time</TableHead>
            <TableHead>Exit Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{log.fullName}</TableCell>
              <TableCell>{log.plateNumber}</TableCell>
              <TableCell>{log.purpose}</TableCell>
              <TableCell className="font-mono">{log.passID}</TableCell>
              <TableCell>{log.entryTime}</TableCell>
              <TableCell>{log.exitTime || '—'}</TableCell>
              <TableCell>
                <Badge variant={log.status === 'Active' ? 'secondary' : 'outline'}>
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitorLogsTable;
