'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true, 
  className 
}) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar placeholder - implement later when needed */}
        {/* {isAuthenticated && showSidebar && <Sidebar />} */}
        
        {/* Main content */}
        <main 
          className={cn(
            'flex-1 transition-all duration-200',
            // Remove sidebar margin for now since no sidebar exists
            // isAuthenticated && showSidebar ? 'ml-64' : '',
            'pt-16', // Account for fixed navbar height
            className
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;