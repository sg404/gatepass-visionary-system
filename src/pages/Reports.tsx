
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { ReportStatistics } from '@/components/reports/ReportStatistics';
import { GateTraffic } from '@/components/reports/GateTraffic';
import { VisitorList } from '@/components/reports/VisitorList';
import { mockReportData, generateReportContent, downloadReport, printReport, exportAllReports } from '@/utils/reportGenerator';
import { ReportPreviewModal } from '@/components/reports/ReportPreviewModal';

const Reports = () => {
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  const handleDownload = () => {
    const content = generateReportContent(mockReportData);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadReport(content, `gate-access-report-${timestamp}.txt`);
    setShowPreview(false);
  };

  const handlePrint = () => {
    printReport();
    setShowPreview(false);
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Reports Management"
        description="View and generate system reports"
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={handleGenerateReport}
        >
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
        <Button 
          size="sm" 
          className="gap-1"
          onClick={exportAllReports}
        >
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </PageHeader>
      
      <div className="space-y-6">
        <ReportStatistics />
        <GateTraffic />
        <VisitorList />
      </div>

      <ReportPreviewModal 
        open={showPreview}
        onOpenChange={setShowPreview}
        reportData={mockReportData}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
    </MainLayout>
  );
};

export default Reports;
