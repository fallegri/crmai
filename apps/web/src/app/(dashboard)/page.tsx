'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import type { Contact, Opportunity, AgendaEvent, ActivityEvent, PaginatedResponse } from '@/lib/types';
import { Users, TrendingUp, DollarSign, Activity, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalContacts: number;
  activeOpportunities: number;
  conversionRate: number;
  wonThisMonth: number;
}

function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-4 w-24 bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted rounded" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [contactsRes, opportunitiesRes, conversionRes, wonRes, activitiesRes, agendaRes] = await Promise.all([
          apiClient.get<PaginatedResponse<Contact>>('/contacts', { limit: 1 }),
          apiClient.get<PaginatedResponse<Opportunity>>('/opportunities', { limit: 1 }),
          apiClient.get<{ rate: number }>('/reporting/conversion/program').catch(() => ({ rate: 0 })),
          apiClient.get<PaginatedResponse<Opportunity>>('/opportunities', { limit: 1, status: 'WON' }),
          apiClient.get<ActivityEvent[]>('/activities').catch(() => []),
          apiClient.get<AgendaEvent[]>('/agenda', {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        ]);

        setStats({
          totalContacts: contactsRes.total ?? 0,
          activeOpportunities: opportunitiesRes.total ?? 0,
          conversionRate: typeof conversionRes === 'object' && 'rate' in conversionRes ? conversionRes.rate : 0,
          wonThisMonth: wonRes.total ?? 0,
        });
        setRecentActivities(Array.isArray(activitiesRes) ? activitiesRes.slice(0, 5) : []);
        setUpcomingEvents(Array.isArray(agendaRes) ? agendaRes : []);
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Contacts', value: stats?.totalContacts ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Active Opportunities', value: stats?.activeOpportunities ?? 0, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Conversion Rate', value: `${((stats?.conversionRate ?? 0) * 100).toFixed(1)}%`, icon: DollarSign, color: 'text-yellow-600' },
    { label: 'Won This Month', value: stats?.wonThisMonth ?? 0, icon: DollarSign, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/activities')}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Activity className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/agenda')}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Badge variant="outline">{event.eventType}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
