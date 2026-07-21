'use client';

import { AppProviders } from '@/contexts/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster />
    </AppProviders>
  );
}
