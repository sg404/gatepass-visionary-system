
import React from 'react';
import { Car, User, Clock, UserPlus, LogIn, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ActivityType = 'entry' | 'exit' | 'registration' | 'visitor';

type Activity = {
  id: string;
  type: ActivityType;
  vehicleId?: string;
  licensePlate: string;
  personName: string;
  timestamp: Date;
  isVisitor?: boolean;
};

// Mock data
const activities: Activity[] = [
  {
    id: '1',
    type: 'entry',
    vehicleId: 'V-10023',
    licensePlate: 'ABC-123',
    personName: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    type: 'exit',
    vehicleId: 'V-10024',
    licensePlate: 'XYZ-789',
    personName: 'Emma Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: '3',
    type: 'entry',
    licensePlate: 'DEF-456',
    personName: 'Michael Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    isVisitor: true
  },
  {
    id: '4',
    type: 'registration',
    vehicleId: 'V-10025',
    licensePlate: 'GHI-789',
    personName: 'Sophia Davis',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '5',
    type: 'exit',
    licensePlate: 'JKL-012',
    personName: 'Daniel Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    isVisitor: true
  },
];

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const getActivityIcon = (type: ActivityType, isVisitor?: boolean) => {
  switch (type) {
    case 'entry':
      return isVisitor ? UserPlus : LogIn;
    case 'exit':
      return LogOut;
    case 'registration':
      return Car;
    case 'visitor':
      return UserPlus;
    default:
      return Clock;
  }
};

const getActivityColor = (type: ActivityType, isVisitor?: boolean) => {
  switch (type) {
    case 'entry':
      return isVisitor ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
    case 'exit':
      return 'bg-blue-100 text-blue-700';
    case 'registration':
      return 'bg-purple-100 text-purple-700';
    case 'visitor':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getActivityText = (activity: Activity) => {
  switch (activity.type) {
    case 'entry':
      return activity.isVisitor 
        ? `Visitor ${activity.personName} entered with vehicle ${activity.licensePlate}`
        : `${activity.personName} entered with vehicle ${activity.licensePlate}`;
    case 'exit':
      return activity.isVisitor
        ? `Visitor ${activity.personName} exited with vehicle ${activity.licensePlate}`
        : `${activity.personName} exited with vehicle ${activity.licensePlate}`;
    case 'registration':
      return `${activity.personName} registered vehicle ${activity.licensePlate}`;
    case 'visitor':
      return `${activity.personName} registered as visitor with vehicle ${activity.licensePlate}`;
    default:
      return '';
  }
};

const ActivityLog = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type, activity.isVisitor);
            const colorClass = getActivityColor(activity.type, activity.isVisitor);
            const text = getActivityText(activity);
            
            return (
              <div key={activity.id} className="flex items-start gap-4 animate-slide-in-bottom" style={{ 
                animationDelay: `${activities.indexOf(activity) * 0.1}s`,
                animationFillMode: 'both' 
              }}>
                <div className={cn("p-2 rounded-full flex items-center justify-center", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{text}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTimeAgo(activity.timestamp)}
                    {activity.vehicleId && (
                      <span className="ml-2 bg-muted px-1.5 py-0.5 rounded-sm">
                        ID: {activity.vehicleId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
