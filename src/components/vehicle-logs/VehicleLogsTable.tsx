
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell
} from '@/components/ui/table';
import { VehicleEntryLog } from '@/types/vehicleEntryLogs';
import { Badge } from '@/components/ui/badge';

interface VehicleLogsTableProps {
  logs: VehicleEntryLog[];
}

const VehicleLogsTable: React.FC<VehicleLogsTableProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Sticker ID</TableHead>
            <TableHead>Plate Number</TableHead>
            <TableHead>Entry Time</TableHead>
            <TableHead>Exit Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{log.fullName}</TableCell>
              <TableCell>
                <Badge variant={log.role === 'Faculty' ? 'secondary' : 'outline'}>
                  {log.role}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">{log.stickerID}</TableCell>
              <TableCell>{log.plateNumber}</TableCell>
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

export default VehicleLogsTable;
