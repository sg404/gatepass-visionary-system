import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    if (role === 'admin') {
      navigate('/admin-login');
    } else if (role === 'guard') {
      navigate('/guard-login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Smart Vehicle Gate Pass System</CardTitle>
          <p className="text-sm text-muted-foreground">Select your role to continue</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-16"
              onClick={() => handleRoleSelection('admin')}
            >
              <Shield className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-medium">Admin</div>
                <div className="text-sm text-muted-foreground">System administration and management</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-16"
              onClick={() => handleRoleSelection('guard')}
            >
              <UserCheck className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-medium">Guard</div>
                <div className="text-sm text-muted-foreground">Entry/Exit gate management</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
