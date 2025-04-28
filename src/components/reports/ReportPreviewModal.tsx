
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { printer, download } from 'lucide-react';
import { ReportData } from '@/utils/reportGenerator';

interface ReportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: ReportData;
  onDownload: () => void;
  onPrint: () => void;
}

export const ReportPreviewModal = ({
  open,
  onOpenChange,
  reportData,
  onDownload,
  onPrint
}: ReportPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-6 p-4 font-mono text-sm">
            <div className="text-center font-bold text-lg">
              GATE ACCESS SYSTEM - COMPREHENSIVE REPORT
            </div>
            <div className="text-right text-sm text-muted-foreground">
              Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
            
            <div>
              <h3 className="font-bold mb-2 border-b">SUMMARY</h3>
              <p>Total Entries: {reportData.totalEntries}</p>
              <p>Total Visitors: {reportData.totalVisitors}</p>
              <p>Parking Occupancy: {reportData.parkingOccupancy.occupied}/{reportData.parkingOccupancy.total} ({reportData.parkingOccupancy.percentage}%)</p>
            </div>

            <div>
              <h3 className="font-bold mb-2 border-b">GATE ACTIVITY</h3>
              <p>New Site Gate: {reportData.gates.newSite} entries</p>
              <p>Old Site Gate: {reportData.gates.oldSite} entries</p>
            </div>

            <div>
              <h3 className="font-bold mb-2 border-b">RECENT VISITORS</h3>
              {reportData.recentVisitors.map((visitor, index) => (
                <p key={index}>
                  {visitor.name} ({visitor.plate}) - {visitor.gate} at {visitor.time}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onPrint}>
            <printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={onDownload}>
            <download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
