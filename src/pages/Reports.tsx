
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportStatistics } from '@/components/reports/ReportStatistics';
import { GateTraffic } from '@/components/reports/GateTraffic';
import { VisitorList } from '@/components/reports/VisitorList';

const Reports = () => {
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report has been generated and is ready for download.",
    });
  };

  const handleExportAll = () => {
    toast({
      title: "Exporting Reports",
      description: "All reports are being exported. This may take a few moments.",
    });
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
          onClick={handleExportAll}
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
    </MainLayout>
  );
};

export default Reports;
