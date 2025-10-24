import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserCheck, FileText, Car } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    if (role === 'admin') {
      navigate('/admin-login');
    } else if (role === 'guard') {
      navigate('/guard-login');
    } else if (role === 'registration') {
      navigate('/registration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Blue Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 items-center justify-center p-8">
        <div className="text-center text-white">
          <Car className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Smart Vehicle Gate Pass System</h1>
          <p className="text-blue-100">Secure and efficient vehicle management</p>
        </div>
      </div>

      {/* Right Side - Role Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600">Select your role to continue</p>
          </div>

          <div className="space-y-4">
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-600 hover:border-2"
              onClick={() => handleRoleSelection('admin')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Admin</h3>
                    <p className="text-sm text-gray-600">System administration and management</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-600 hover:border-2"
              onClick={() => handleRoleSelection('guard')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <UserCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Guard</h3>
                    <p className="text-sm text-gray-600">Entry/Exit gate management</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-600 hover:border-2"
              onClick={() => handleRoleSelection('registration')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Vehicle Registration</h3>
                    <p className="text-sm text-gray-600">Online vehicle registration system</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            © 2025 Smart Vehicle Gate Pass System | Version 2
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
