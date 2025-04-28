
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface AccessLogFilterProps {
  onFilterApply: (filters: Record<string, string>) => void;
}

export const AccessLogFilter: React.FC<AccessLogFilterProps> = ({ onFilterApply }) => {
  const [filters, setFilters] = useState({
    user: '',
    role: '',
    action: '',
    site: '',
    dutyType: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterApply(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      user: '',
      role: '',
      action: '',
      site: '',
      dutyType: '',
    });
    onFilterApply({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">User</label>
            <Input
              placeholder="Search by name"
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={filters.role}
              onValueChange={(value) => handleFilterChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SEDMMO Staff">SEDMMO Staff</SelectItem>
                <SelectItem value="Guard">Guard</SelectItem>
                <SelectItem value="Faculty">Faculty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Action</label>
            <Select
              value={filters.action}
              onValueChange={(value) => handleFilterChange('action', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Login">Login</SelectItem>
                <SelectItem value="Logout">Logout</SelectItem>
                <SelectItem value="On Duty">On Duty</SelectItem>
                <SelectItem value="Issues Pass">Issues Pass</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Site</label>
            <Select
              value={filters.site}
              onValueChange={(value) => handleFilterChange('site', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="Old Site">Old Site</SelectItem>
                <SelectItem value="New Site">New Site</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Duty Type</label>
            <Select
              value={filters.dutyType}
              onValueChange={(value) => handleFilterChange('dutyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Duties</SelectItem>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
