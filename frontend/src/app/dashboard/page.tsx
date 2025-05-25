'use client';

import React from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Layout from '@/components/layout/Layout';

// Disable SSR for this page
export const dynamic = 'force-dynamic';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here is what is happening with your personality traits today.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Dashboard Coming Soon</h2>
          <p className="text-gray-600">
            Your personalized dashboard with analytics, traits, and more will be available here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(DashboardPage);