'use client';

import React from 'react';
import { withAuth } from '@/lib/contexts/AuthContext';
import TraitsBrowsePage from '@/components/pages/TraitsBrowsePage';

// Disable SSR for this page
export const dynamic = 'force-dynamic';

const TraitsPage: React.FC = () => {
  return <TraitsBrowsePage />;
};

export default withAuth(TraitsPage);