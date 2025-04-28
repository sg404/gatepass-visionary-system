
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
    type?: string;
  }>;
}

export const mockReportData: ReportData = {
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
    { name: 'David Natan Apruebo', plate: 'ABC 123', gate: 'New Site', time: '09:45 AM' },
    { name: 'Emmilry Magic Cadesim', plate: 'XYZ 789', gate: 'Old Site', time: '10:15 AM' },
    { name: 'Shekinah Gayonoche', plate: 'DEF 456', gate: 'New Site', time: '11:30 AM' },
    { name: 'Aerella Lou Nicor', plate: 'GHI 789', gate: 'Old Site', time: '01:20 PM' },
    { name: 'Christian Porras', plate: 'JKL 012', gate: 'New Site', time: '02:45 PM' },
    { name: 'Angielou Sujede', plate: 'MNO 345', gate: 'Old Site', time: '03:15 PM' },
    { name: 'Victor Jom Sorita', plate: 'PQR 678', gate: 'New Site', time: '04:00 PM' },
    { name: 'Hannah Planco', plate: 'STU 901', gate: 'Old Site', time: '04:30 PM' },
    { name: 'Reynaldo Ilangos', plate: 'VWX 234', gate: 'New Site', time: '05:00 PM', type: 'faculty' },
  ],
};

export const generateReportContent = (data: ReportData): string => {
  return `GATE ACCESS SYSTEM - COMPREHENSIVE REPORT
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

SUMMARY
-------
Total Entries: ${data.totalEntries}
Total Visitors: ${data.totalVisitors}
Parking Occupancy: ${data.parkingOccupancy.occupied}/${data.parkingOccupancy.total} (${data.parkingOccupancy.percentage}%)

GATE ACTIVITY
------------
New Site Gate: ${data.gates.newSite} entries
Old Site Gate: ${data.gates.oldSite} entries

RECENT VISITORS
--------------
${data.recentVisitors.map(visitor => 
  `${visitor.name}${visitor.type ? ` (${visitor.type})` : ''} (${visitor.plate}) - ${visitor.gate} at ${visitor.time}`
).join('\n')}`;
};

export const downloadReport = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  toast({
    title: "Report Downloaded",
    description: "Your report has been downloaded successfully.",
  });
};

export const printReport = () => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const content = generateReportContent(mockReportData);
    printWindow.document.write(`
      <html>
        <head>
          <title>Gate Access System Report</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

export const exportAllReports = () => {
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
    }, index * 1000);
  });

  toast({
    title: "Reports Exported",
    description: "All reports have been downloaded successfully.",
  });
};
