
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const recentVisitors = [
  { name: 'Juan Dela Cruz', plate: 'ABC 123', gate: 'New Site', time: '09:45 AM' },
  { name: 'Maria Santos', plate: 'XYZ 789', gate: 'Old Site', time: '10:15 AM' },
  { name: 'Pedro Reyes', plate: 'DEF 456', gate: 'New Site', time: '11:30 AM' },
  { name: 'Ana Garcia', plate: 'GHI 789', gate: 'Old Site', time: '01:20 PM' },
  { name: 'Ramon Cruz', plate: 'JKL 012', gate: 'New Site', time: '02:45 PM' },
];

export const VisitorList = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor Name</TableHead>
              <TableHead>Plate Number</TableHead>
              <TableHead>Gate Location</TableHead>
              <TableHead>Entry Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentVisitors.map((visitor) => (
              <TableRow key={visitor.plate}>
                <TableCell>{visitor.name}</TableCell>
                <TableCell>{visitor.plate}</TableCell>
                <TableCell>{visitor.gate}</TableCell>
                <TableCell>{visitor.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
