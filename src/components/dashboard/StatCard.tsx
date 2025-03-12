
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: 'default' | 'primary' | 'secondary' | 'destructive';
  className?: string;
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  colorScheme = 'default',
  className 
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex flex-col">
              <h3 className={cn(
                "text-2xl font-bold",
                colorScheme === 'primary' && "text-primary",
                colorScheme === 'secondary' && "text-blue-600",
                colorScheme === 'destructive' && "text-destructive"
              )}>
                {value}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
              {trend && (
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-destructive"
                  )}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="text-xs text-muted-foreground">from previous period</span>
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-md",
            colorScheme === 'default' && "bg-muted",
            colorScheme === 'primary' && "bg-primary/10",
            colorScheme === 'secondary' && "bg-blue-50",
            colorScheme === 'destructive' && "bg-destructive/10"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              colorScheme === 'default' && "text-foreground",
              colorScheme === 'primary' && "text-primary",
              colorScheme === 'secondary' && "text-blue-600",
              colorScheme === 'destructive' && "text-destructive"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
