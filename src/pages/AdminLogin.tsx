import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn, Building, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate admin login with specific credentials
    if (email === 'admin@ssedmmo.edu.ph' && password === 'admin123') {
      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({
        email,
        role: 'admin',
        name: 'SSEDMMO Administrator'
      }));
      navigate('/admin-dashboard');
    } else {
      alert('Invalid credentials. Please use admin@ssedmmo.edu.ph / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Yellow Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-yellow-400 items-center justify-center p-8">
        <div className="text-center text-blue-900">
          <Building className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Admin Portal</h1>
          <p className="text-blue-700">System administration</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12"
                    required
                  />
                </div>
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
};

export default AdminLogin;
