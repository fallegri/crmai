'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import type { ActivityEvent, Contact } from '@/lib/types';
import { Plus, Phone, Mail, Users, Calendar, MessageSquare, Activity } from 'lucide-react';

const TYPE_ICONS: Record<string, typeof Activity> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  visit: Calendar,
  task: MessageSquare,
};

interface ActivityForm {
  contactId: string;
  type: string;
  title: string;
  description: string;
}

const emptyForm: ActivityForm = { contactId: '', type: 'call', title: '', description: '' };

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ActivityForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (typeFilter) params.type = typeFilter;
      if (dateFrom) params.from = new Date(dateFrom).toISOString();
      if (dateTo) params.to = new Date(dateTo).toISOString();
      if (search) params.search = search;
      const res = await apiClient.get<ActivityEvent[]>('/activities', params);
      const list = Array.isArray(res) ? res : [];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivities(list);
    } catch {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, dateFrom, dateTo, search]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  useEffect(() => {
    apiClient.get<Contact[]>('/contacts', { limit: 100 })
      .then((res) => {
        const data = Array.isArray(res) ? res : (res as any).data ?? [];
        setContacts(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.post('/activities', form);
      setDialogOpen(false);
      setForm(emptyForm);
      fetchActivities();
    } catch {
      setError('Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  const getContactName = (contactId: string) => {
    const c = contacts.find((c) => c.id === contactId);
    return c ? `${c.firstName} ${c.lastName}` : contactId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Button onClick={() => { setForm(emptyForm); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Record Activity
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Label className="shrink-0">Type:</Label>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="visit">Visit</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="shrink-0">From:</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="shrink-0">To:</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
        </div>
        <Input
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-60"
        />
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-16" />
            </Card>
          ))
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No activities found
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => {
            const Icon = TYPE_ICONS[activity.type] ?? Activity;
            return (
              <Card key={activity.id}>
                <CardContent className="flex items-start gap-4 py-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.type && <Badge variant="outline" className="capitalize text-xs">{activity.type}</Badge>}
                    </div>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      {activity.contactId && (
                        <span className="text-xs text-primary">{getContactName(activity.contactId)}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Activity</DialogTitle>
            <DialogDescription>Log a new activity for a contact.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="actContact">Contact</Label>
              <Select value={form.contactId} onValueChange={(v) => setForm({ ...form, contactId: v })}>
                <SelectTrigger id="actContact">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actType">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger id="actType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="visit">Visit</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actTitle">Title</Label>
              <Input id="actTitle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actDesc">Description</Label>
              <Input id="actDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
