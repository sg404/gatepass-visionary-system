
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Camera,
  Radio,
  Clock,
  Bell,
  Database,
  AlertTriangle,
  Car
} from 'lucide-react';

const SettingsPanel = () => {
  const [anprThreshold, setAnprThreshold] = useState(85);
  const [rfidScanDistance, setRfidScanDistance] = useState(3);
  const [visitorPassExpiry, setVisitorPassExpiry] = useState(12);
  const [isEditingParking, setIsEditingParking] = useState(false);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="parking">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mb-4">
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">ANPR Configuration</CardTitle>
                  <CardDescription>Configure automatic number plate recognition settings</CardDescription>
                </div>
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="anpr-threshold">Recognition Threshold (%)</Label>
                  <span className="text-sm font-medium">{anprThreshold}%</span>
                </div>
                <Input 
                  id="anpr-threshold" 
                  type="range" 
                  min="50" 
                  max="99" 
                  value={anprThreshold} 
                  onChange={(e) => setAnprThreshold(parseInt(e.target.value))}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Set the confidence threshold for license plate recognition. Higher values require more accurate matches.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="camera-ip">Camera IP Address</Label>
                  <Input id="camera-ip" placeholder="192.168.1.100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera-port">Camera Port</Label>
                  <Input id="camera-port" placeholder="8080" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="anpr-active">ANPR System Status</Label>
                  <span className="text-xs text-muted-foreground">Enable or disable ANPR recognition</span>
                </div>
                <Switch id="anpr-active" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">RFID Configuration</CardTitle>
                  <CardDescription>Configure RFID reader settings</CardDescription>
                </div>
                <Radio className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rfid-distance">Scan Distance (meters)</Label>
                  <span className="text-sm font-medium">{rfidScanDistance}m</span>
                </div>
                <Input 
                  id="rfid-distance" 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="0.5"
                  value={rfidScanDistance} 
                  onChange={(e) => setRfidScanDistance(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Set the maximum distance for RFID tag scanning.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rfid-port">RFID COM Port</Label>
                  <Input id="rfid-port" placeholder="COM3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfid-baud">Baud Rate</Label>
                  <Input id="rfid-baud" placeholder="9600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rfid-active">RFID System Status</Label>
                  <span className="text-xs text-muted-foreground">Enable or disable RFID scanning</span>
                </div>
                <Switch id="rfid-active" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Access Control</CardTitle>
                  <CardDescription>Configure system security settings</CardDescription>
                </div>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="double-auth">Double Authentication</Label>
                  <span className="text-xs text-muted-foreground">Require both RFID and ANPR to match</span>
                </div>
                <Switch id="double-auth" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="fallback-mode">Fallback Mode</Label>
                  <span className="text-xs text-muted-foreground">Allow manual entry when systems fail</span>
                </div>
                <Switch id="fallback-mode" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="blacklist-alerts">Blacklist Alerts</Label>
                  <span className="text-xs text-muted-foreground">Alert security for blacklisted vehicles</span>
                </div>
                <Switch id="blacklist-alerts" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="log-retention">Security Log Retention (days)</Label>
                <Input id="log-retention" type="number" min="30" defaultValue="90" />
                <p className="text-xs text-muted-foreground">Number of days to keep security logs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Visitor Management</CardTitle>
                  <CardDescription>Configure visitor access settings</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="visitor-expiry">Visitor Pass Expiry (hours)</Label>
                  <span className="text-sm font-medium">{visitorPassExpiry} hours</span>
                </div>
                <Input 
                  id="visitor-expiry" 
                  type="range" 
                  min="1" 
                  max="48" 
                  value={visitorPassExpiry} 
                  onChange={(e) => setVisitorPassExpiry(parseInt(e.target.value))}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Set how long visitor passes remain valid</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="visitor-approval">Require Admin Approval</Label>
                  <span className="text-xs text-muted-foreground">Admin must approve all visitor entries</span>
                </div>
                <Switch id="visitor-approval" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="visitor-photo">Capture Visitor Photo</Label>
                  <span className="text-xs text-muted-foreground">Store visitor's photo with entry record</span>
                </div>
                <Switch id="visitor-photo" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Alert Configuration</CardTitle>
                  <CardDescription>Setup system notifications and alerts</CardDescription>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <span className="text-xs text-muted-foreground">Send email notifications for critical events</span>
                </div>
                <Switch id="email-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                  <span className="text-xs text-muted-foreground">Send text messages for emergency situations</span>
                </div>
                <Switch id="sms-alerts" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="system-sounds">System Sounds</Label>
                  <span className="text-xs text-muted-foreground">Play alert sounds for events</span>
                </div>
                <Switch id="system-sounds" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-emails">Alert Recipients</Label>
                <Input id="alert-emails" placeholder="admin@example.com, security@example.com" />
                <p className="text-xs text-muted-foreground">Comma-separated list of email addresses</p>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Alert Types</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Security Breach
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Blacklisted Vehicle
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> System Failure
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parking" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Parking Configuration</CardTitle>
                  <CardDescription>Configure parking slot settings and capacity</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingParking(!isEditingParking)}
                >
                  {isEditingParking ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="total-slots">Total Parking Slots</Label>
                <Input
                  id="total-slots"
                  type="number"
                  min="1"
                  max="1000"
                  defaultValue="100"
                  placeholder="Enter total parking slots"
                  disabled={!isEditingParking}
                />
                <p className="text-xs text-muted-foreground">Set the total number of parking slots available in the system</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty-slots">Faculty Slots</Label>
                  <Input id="faculty-slots" type="number" min="0" defaultValue="30" disabled={!isEditingParking} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-slots">Student Slots</Label>
                  <Input id="student-slots" type="number" min="0" defaultValue="50" disabled={!isEditingParking} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitor-slots">Visitor Slots</Label>
                  <Input id="visitor-slots" type="number" min="0" defaultValue="20" disabled={!isEditingParking} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reserved-slots">Reserved Slots</Label>
                  <Input id="reserved-slots" type="number" min="0" defaultValue="10" disabled={!isEditingParking} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="auto-assign">Auto-assign Parking Slots</Label>
                  <span className="text-xs text-muted-foreground">Automatically assign available slots to vehicles</span>
                </div>
                <Switch id="auto-assign" defaultChecked disabled={!isEditingParking} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="overbooking-alert">Overbooking Alerts</Label>
                  <span className="text-xs text-muted-foreground">Alert when parking slots are over capacity</span>
                </div>
                <Switch id="overbooking-alert" defaultChecked disabled={!isEditingParking} />
              </div>

              {isEditingParking && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingParking(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditingParking(false)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Database Configuration</CardTitle>
                  <CardDescription>Configure database connection and backup settings</CardDescription>
                </div>
                <Database className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Database Host</Label>
                  <Input id="db-host" placeholder="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Database Port</Label>
                  <Input id="db-port" placeholder="5432" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input id="db-name" placeholder="smart_vehicle_gate_pass_db" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">Database User</Label>
                  <Input id="db-user" placeholder="admin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-schedule">Automatic Backup Schedule</Label>
                <select id="backup-schedule" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="daily">Daily (at midnight)</option>
                  <option value="weekly">Weekly (Sunday at midnight)</option>
                  <option value="monthly">Monthly (1st of month)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="auto-cleanup">Automatic Data Cleanup</Label>
                  <span className="text-xs text-muted-foreground">Periodically remove old data</span>
                </div>
                <Switch id="auto-cleanup" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
