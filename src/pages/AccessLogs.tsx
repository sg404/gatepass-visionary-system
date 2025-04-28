
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Printer, Download } from 'lucide-react';
import AccessLogsTable from '@/components/access-logs/AccessLogsTable';
import { mockAccessLogs } from '@/data/mockAccessLogs';
import { AccessLogFilter } from '@/components/access-logs/AccessLogFilter';
import { AccessLog } from '@/types/accessLogs';

const AccessLogs = () => {
  const [logs, setLogs] = useState<AccessLog[]>(mockAccessLogs);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleRefresh = () => {
    // In a real app, this would fetch updated logs from an API
    setLogs([...mockAccessLogs]);
  };
  
  const handleFilter = (filters: Record<string, string>) => {
    // Apply filters to the logs
    let filteredLogs = [...mockAccessLogs];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filteredLogs = filteredLogs.filter(log => {
          if (key === 'dateRange') {
            // Date range filtering would be implemented here
            return true;
          }
          return log[key as keyof AccessLog]?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    
    setLogs(filteredLogs);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    const csvContent = [
      // CSV header
      Object.keys(logs[0]).join(','),
      // CSV data rows
      ...logs.map(log => Object.values(log).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'access-logs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Access Logs"
        description="Track and monitor system access and activities"
      >
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
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
      
      {showFilters && (
        <div className="mb-6">
          <AccessLogFilter onFilterApply={handleFilter} />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow">
        <AccessLogsTable logs={logs} />
      </div>
    </MainLayout>
  );
};

export default AccessLogs;
