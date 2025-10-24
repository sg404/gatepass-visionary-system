
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn, UserCheck, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuardLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'entry' | 'exit'>('entry');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Side - Blue Background */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-900 items-center justify-center p-8">
          <div className="text-center text-white">
            <Shield className="mx-auto h-16 w-16 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Guard Portal</h1>
            <p className="text-blue-100">Secure access management</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <Card className={`w-full max-w-md shadow-lg transition-all duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-900">Guard Login</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-900 hover:bg-blue-800 transition-colors duration-300"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Button>
                <div className="text-center">
                  <Button variant="link" className="text-sm text-gray-500 hover:text-blue-600">
                    Forgot Password?
                  </Button>
                </div>
              </form>
              <div className="mt-6 text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Role Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Blue Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 items-center justify-center p-8">
        <div className="text-center text-white">
          <Shield className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Guard Portal</h1>
          <p className="text-blue-100">Secure access management</p>
        </div>
      </div>

      {/* Right Side - Role Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Select Your Role</CardTitle>
            <p className="text-sm text-gray-600">Welcome, {username}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                variant={selectedRole === 'entry' ? 'default' : 'outline'}
                className={`w-full h-16 justify-start transition-all duration-300 ${
                  selectedRole === 'entry'
                    ? 'bg-blue-900 hover:bg-blue-800 border-blue-900'
                    : 'hover:scale-105 hover:border-blue-600'
                }`}
                onClick={() => setSelectedRole('entry')}
              >
                <Shield className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Entry Guard</div>
                  <div className="text-sm opacity-90">Manage vehicle entry</div>
                </div>
              </Button>

              <Button
                variant={selectedRole === 'exit' ? 'default' : 'outline'}
                className={`w-full h-16 justify-start transition-all duration-300 ${
                  selectedRole === 'exit'
                    ? 'bg-blue-900 hover:bg-blue-800 border-blue-900'
                    : 'hover:scale-105 hover:border-blue-600'
                }`}
                onClick={() => setSelectedRole('exit')}
              >
                <LogOut className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Exit Guard</div>
                  <div className="text-sm opacity-90">Manage vehicle exit</div>
                </div>
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBackToLogin}
                className="flex-1 h-12 underline"
              >
                Back
              </Button>
              <Button
                onClick={handleRoleSelection}
                className="flex-1 h-12 bg-blue-900 hover:bg-blue-800 transition-colors duration-300 underline"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuardLogin;
