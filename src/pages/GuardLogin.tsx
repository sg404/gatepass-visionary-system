
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn, UserCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuardLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'entry' | 'exit'>('entry');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate guard login - in real app this would authenticate with backend
    if (username && password) {
      setShowRoleSelection(true);
    }
  };

  const handleRoleSelection = () => {
    // Store guard session with selected role
    localStorage.setItem('guardSession', JSON.stringify({ username, role: selectedRole }));
    // Navigate to appropriate dashboard based on role
    if (selectedRole === 'entry') {
      navigate('/entry-guard-dashboard');
    } else {
      navigate('/exit-guard-dashboard');
    }
  };

  const handleBackToLogin = () => {
    setShowRoleSelection(false);
    setSelectedRole('entry');
  };

  if (!showRoleSelection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Guard Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button variant="link" className="w-full text-sm">
                Forgot Password?
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Select Your Role</CardTitle>
          <p className="text-sm text-muted-foreground">Welcome, {username}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant={selectedRole === 'entry' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setSelectedRole('entry')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Entry Guard
            </Button>

            <Button
              variant={selectedRole === 'exit' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setSelectedRole('exit')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Guard
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToLogin} className="flex-1">
              Back
            </Button>
            <Button onClick={handleRoleSelection} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardLogin;
