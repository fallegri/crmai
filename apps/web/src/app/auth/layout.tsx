'use client';

import { AppProviders } from '@/contexts/providers';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
