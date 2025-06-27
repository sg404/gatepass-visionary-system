
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Printer, Download, Calendar } from 'lucide-react';
import VehicleLogsTable from '@/components/vehicle-logs/VehicleLogsTable';
import VisitorLogsTable from '@/components/vehicle-logs/VisitorLogsTable';
import { mockVehicleEntryLogs, mockVisitorEntryLogs } from '@/data/mockVehicleEntryLogs';
import { VehicleEntryLog, VisitorEntryLog } from '@/types/vehicleEntryLogs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VehicleEntryLogs = () => {
  const [vehicleLogs, setVehicleLogs] = useState<VehicleEntryLog[]>(mockVehicleEntryLogs);
  const [visitorLogs, setVisitorLogs] = useState<VisitorEntryLog[]>(mockVisitorEntryLogs);
  const [reportType, setReportType] = useState("daily");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
  const handleRefresh = () => {
    // In a real app, this would fetch updated logs from an API
    setVehicleLogs([...mockVehicleEntryLogs]);
    setVisitorLogs([...mockVisitorEntryLogs]);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadCSV = (type: 'vehicle' | 'visitor') => {
    if (type === 'vehicle') {
      const headers = ['Full Name', 'Role', 'Sticker ID', 'Plate Number', 'Entry Time', 'Exit Time', 'Status'];
      const mappedData = vehicleLogs.map((log: VehicleEntryLog) => [
        log.fullName,
        log.role,
        log.stickerID,
        log.plateNumber,
        log.entryTime,
        log.exitTime || '',
        log.status
      ]);
      
      const csvContent = [
        headers.join(','),
        ...mappedData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vehicle-entry-logs.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Full Name', 'Plate Number', 'Purpose', 'Pass ID', 'Entry Time', 'Exit Time', 'Status'];
      const mappedData = visitorLogs.map((log: VisitorEntryLog) => [
        log.fullName,
        log.plateNumber,
        log.purpose,
        log.passID,
        log.entryTime,
        log.exitTime || '',
        log.status
      ]);
      
      const csvContent = [
        headers.join(','),
        ...mappedData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitor-entry-logs.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const generateReport = () => {
    // In a real app, this would generate a report based on the selected type
    // For now, we'll just show a different message based on the report type
    setReportDialogOpen(true);
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Vehicle Entry/Exit Logs"
        description="Track and monitor vehicle entries and exits"
      >
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={() => setReportDialogOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Vehicle Entry/Exit Report</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                    <Button onClick={() => handleDownloadCSV('vehicle')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </PageHeader>
      
      <Tabs defaultValue="auto-logged" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="auto-logged">Auto-Logged (UHF Sticker)</TabsTrigger>
          <TabsTrigger value="manual-visitor">Visitors (Temporary Pass)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto-logged" className="bg-white rounded-lg shadow">
          <VehicleLogsTable logs={vehicleLogs} />
        </TabsContent>
        
        <TabsContent value="manual-visitor" className="bg-white rounded-lg shadow">
          <VisitorLogsTable logs={visitorLogs} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default VehicleEntryLogs;
