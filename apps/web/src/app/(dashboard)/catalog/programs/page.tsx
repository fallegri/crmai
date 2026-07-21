'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import type { Program, Faculty } from '@/lib/types';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

interface ProgramForm {
  name: string;
  code: string;
  description: string;
  facultyId: string;
  durationMonths: number;
}

const emptyForm: ProgramForm = { name: '', code: '', description: '', facultyId: '', durationMonths: 0 };

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [progsRes, facsRes] = await Promise.all([
        selectedFacultyId
          ? apiClient.get<Program[]>(`/catalog/faculties/${selectedFacultyId}/programs`)
          : apiClient.get<Program[]>('/catalog/programs'),
        apiClient.get<Faculty[]>('/catalog/faculties'),
      ]);
      setPrograms(Array.isArray(progsRes) ? progsRes : []);
      setFaculties(Array.isArray(facsRes) ? facsRes : []);
    } catch {
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, [selectedFacultyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, durationMonths: Number(form.durationMonths) };
      if (editingProgram) {
        await apiClient.put(`/catalog/programs/${editingProgram.id}`, payload);
      } else {
        await apiClient.post('/catalog/programs', payload);
      }
      setDialogOpen(false);
      setEditingProgram(null);
      setForm(emptyForm);
      fetchData();
    } catch {
      setError('Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/catalog/programs/${deleteTarget.id}`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch {
      setError('Failed to delete program');
    }
  };

  const openEditDialog = (program: Program) => {
    setEditingProgram(program);
    setForm({
      name: program.name,
      code: program.code ?? '',
      description: program.description ?? '',
      facultyId: program.facultyId ?? '',
      durationMonths: program.durationMonths ?? 0,
    });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingProgram(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const getFacultyName = (facultyId: string) =>
    faculties.find((f) => f.id === facultyId)?.name ?? facultyId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Button onClick={openNewDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Program
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Label className="shrink-0">Faculty:</Label>
        <Select value={selectedFacultyId} onValueChange={(v) => setSelectedFacultyId(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="All Faculties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            {faculties.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Code</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Faculty</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Active</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-muted animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No programs found</td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{program.name}</td>
                    <td className="p-4 text-sm">{program.code}</td>
                    <td className="p-4 text-sm">{getFacultyName(program.facultyId)}</td>
                    <td className="p-4 text-sm">{program.durationMonths} months</td>
                    <td className="p-4">
                      <Badge variant={program.isActive !== false ? 'default' : 'secondary'}>
                        {program.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(program)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget(program); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push('/catalog/cohorts')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProgram ? 'Edit Program' : 'New Program'}</DialogTitle>
            <DialogDescription>Fill in the program details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="progName">Name</Label>
              <Input id="progName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progCode">Code</Label>
              <Input id="progCode" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progFaculty">Faculty</Label>
              <Select value={form.facultyId} onValueChange={(v) => setForm({ ...form, facultyId: v })}>
                <SelectTrigger id="progFaculty">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="progDesc">Description</Label>
              <Input id="progDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progDuration">Duration (months)</Label>
              <Input id="progDuration" type="number" value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })} />
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteTarget?.name}? This action cannot be undone.
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
