
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/ui/PageHeader';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="System Settings"
        description="Configure system parameters and access controls"
      >
        <Button variant="outline" size="sm" className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Reset Defaults
        </Button>
        <Button size="sm" className="gap-1">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>
      
      <SettingsPanel />
    </MainLayout>
  );
};

export default Settings;
