
import { toast } from "@/hooks/use-toast";

export interface ReportData {
  totalEntries: number;
  totalVisitors: number;
  parkingOccupancy: {
    occupied: number;
    total: number;
    percentage: number;
  };
  gates: {
    newSite: number;
    oldSite: number;
  };
  recentVisitors: Array<{
    name: string;
    plate: string;
    gate: string;
    time: string;
  }>;
}

const mockReportData: ReportData = {
  totalEntries: 2547,
  totalVisitors: 412,
  parkingOccupancy: {
    occupied: 145,
    total: 185,
    percentage: 78,
  },
  gates: {
    newSite: 1247,
    oldSite: 1300,
  },
  recentVisitors: [
    { name: 'Juan Dela Cruz', plate: 'ABC 123', gate: 'New Site', time: '09:45 AM' },
    { name: 'Maria Santos', plate: 'XYZ 789', gate: 'Old Site', time: '10:15 AM' },
    { name: 'Pedro Reyes', plate: 'DEF 456', gate: 'New Site', time: '11:30 AM' },
    { name: 'Ana Garcia', plate: 'GHI 789', gate: 'Old Site', time: '01:20 PM' },
    { name: 'Ramon Cruz', plate: 'JKL 012', gate: 'New Site', time: '02:45 PM' },
  ],
};

export const generateReport = () => {
  const report = mockReportData;
  const reportContent = `
GATE ACCESS SYSTEM - COMPREHENSIVE REPORT
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

SUMMARY
-------
Total Entries: ${report.totalEntries}
Total Visitors: ${report.totalVisitors}
Parking Occupancy: ${report.parkingOccupancy.occupied}/${report.parkingOccupancy.total} (${report.parkingOccupancy.percentage}%)

GATE ACTIVITY
------------
New Site Gate: ${report.gates.newSite} entries
Old Site Gate: ${report.gates.oldSite} entries

RECENT VISITORS
--------------
${report.recentVisitors.map(visitor => 
  `${visitor.name} (${visitor.plate}) - ${visitor.gate} at ${visitor.time}`
).join('\n')}
`;

  // Create blob and download
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  link.href = url;
  link.download = `gate-access-report-${timestamp}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  toast({
    title: "Report Generated",
    description: "Your report has been downloaded successfully.",
  });
};

export const exportAllReports = () => {
  // Create a ZIP file with daily, weekly, and monthly reports
  const reports = [
    { name: 'daily-report', data: mockReportData },
    { name: 'weekly-report', data: mockReportData },
    { name: 'monthly-report', data: mockReportData }
  ];

  reports.forEach((report, index) => {
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(report.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      
      link.href = url;
      link.download = `${report.name}-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, index * 1000); // Delay each download by 1 second
  });

  toast({
    title: "Reports Exported",
    description: "All reports have been downloaded successfully.",
  });
};

