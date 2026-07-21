'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { apiClient } from '@/lib/api-client';
import type { AgendaEvent } from '@/lib/types';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const EVENT_TYPE_COLORS: Record<string, string> = {
  meeting: 'bg-blue-500',
  call: 'bg-green-500',
  visit: 'bg-orange-500',
  task: 'bg-purple-500',
};

interface AgendaForm {
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
}

const emptyForm: AgendaForm = {
  title: '',
  description: '',
  eventType: 'meeting',
  startDate: '',
  endDate: '',
  allDay: false,
};

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [form, setForm] = useState<AgendaForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<AgendaEvent[]>('/agenda', {
        startDate: calendarStart.toISOString(),
        endDate: calendarEnd.toISOString(),
      });
      setEvents(Array.isArray(res) ? res : []);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const getDayEvents = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.startDate), day));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      };
      if (editingEvent) {
        await apiClient.put(`/agenda/${editingEvent.id}`, payload);
      } else {
        await apiClient.post('/agenda', payload);
      }
      setDialogOpen(false);
      setEditingEvent(null);
      setForm(emptyForm);
      fetchEvents();
    } catch {
      setError('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await apiClient.delete(`/agenda/${selectedEvent.id}`);
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
      setEventDetailOpen(false);
      fetchEvents();
    } catch {
      setError('Failed to delete event');
    }
  };

  const openNewDialog = (day?: Date) => {
    setEditingEvent(null);
    setForm({
      ...emptyForm,
      startDate: day ? format(day, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDate: day ? format(day, "yyyy-MM-dd'T'HH:mm") : '',
    });
    setDialogOpen(true);
  };

  const openEditEvent = (event: AgendaEvent) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description ?? '',
      eventType: event.eventType,
      startDate: format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: event.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : '',
      allDay: event.allDay ?? false,
    });
    setEventDetailOpen(false);
    setDialogOpen(true);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <Button onClick={() => openNewDialog()}>
          <Plus className="mr-2 h-4 w-4" /> New Event
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl">{format(currentDate, 'MMMM yyyy')}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayEvents = getDayEvents(day);
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'min-h-24 p-2 border-b border-r last:border-r-0 text-left hover:bg-muted/50 transition-colors',
                    !isSameMonth(day, currentDate) && 'text-muted-foreground/50',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm',
                      isToday(day) && 'bg-primary text-primary-foreground font-bold',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'h-1.5 w-full rounded-full',
                          EVENT_TYPE_COLORS[event.eventType] ?? 'bg-gray-400'
                        )}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDay && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{format(selectedDay, 'EEEE, MMMM d, yyyy')}</CardTitle>
            <Button size="sm" onClick={() => openNewDialog(selectedDay)}>
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : getDayEvents(selectedDay).length === 0 ? (
              <p className="text-sm text-muted-foreground">No events for this day</p>
            ) : (
              <div className="space-y-2">
                {getDayEvents(selectedDay).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedEvent(event); setEventDetailOpen(true); }}
                  >
                    <div className={cn('w-2 h-full min-h-10 rounded-full', EVENT_TYPE_COLORS[event.eventType] ?? 'bg-gray-400')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.startDate), 'HH:mm')}
                        {event.endDate && ` - ${format(new Date(event.endDate), 'HH:mm')}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">{event.eventType}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
            <DialogDescription>Fill in the event details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="evTitle">Title</Label>
              <Input id="evTitle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evDesc">Description</Label>
              <Input id="evDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evType">Event Type</Label>
              <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
                <SelectTrigger id="evType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="visit">Visit</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evStart">Start</Label>
                <Input id="evStart" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evEnd">End</Label>
                <Input id="evEnd" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="evAllDay"
                checked={form.allDay}
                onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
                className="rounded border-input"
              />
              <Label htmlFor="evAllDay">All day</Label>
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

      <Dialog open={eventDetailOpen} onOpenChange={setEventDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{selectedEvent.eventType}</Badge>
              </div>
              {selectedEvent.description && (
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              )}
              <div className="text-sm">
                <p><span className="text-muted-foreground">Start:</span> {new Date(selectedEvent.startDate).toLocaleString()}</p>
                {selectedEvent.endDate && (
                  <p><span className="text-muted-foreground">End:</span> {new Date(selectedEvent.endDate).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => selectedEvent && openEditEvent(selectedEvent)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEvent?.title}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
