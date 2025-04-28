import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Shield, 
  Settings, 
  Menu, 
  X,
  LogOut,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Vehicles',
    href: '/vehicles',
    icon: Car,
  },
  {
    label: 'Visitors',
    href: '/visitors',
    icon: Users,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    label: 'Security',
    href: '/security',
    icon: Shield,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {expanded ? (
            <div className="font-semibold text-lg tracking-tight text-sidebar-foreground flex items-center">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-3">
                <span className="text-white font-medium text-sm">GP</span>
              </div>
              <span>Gate Pass</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto">
              <span className="text-white font-medium text-sm">GP</span>
            </div>
          )}
          <Button 
            onClick={toggleSidebar} 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {expanded ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>

        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center group rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    location.pathname === item.href 
                      ? "bg-sidebar-accent text-sidebar-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50",
                    !expanded && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", 
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-sidebar-foreground/50 group-hover:text-primary/80",
                    expanded ? "mr-3" : "mr-0"
                  )} />
                  {expanded && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center",
            !expanded && "justify-center"
          )}>
            {expanded ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-primary font-medium">
                  AD
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
                  <span className="text-xs text-sidebar-foreground/60">admin@example.com</span>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-primary font-medium">
                AD
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
