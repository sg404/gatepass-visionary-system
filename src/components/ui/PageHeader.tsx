
import React from 'react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

const PageHeader = ({ title, description, children, className }: PageHeaderProps) => {
  return (
    <div className={cn("mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 md:ml-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
