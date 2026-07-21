'use client';

import { useState, useEffect, useCallback } from 'react';
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
import type { Cohort, Faculty, Program } from '@/lib/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CohortForm {
  name: string;
  programId: string;
  startDate: string;
  endDate: string;
}

const emptyForm: CohortForm = { name: '', programId: '', startDate: '', endDate: '' };

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Cohort | null>(null);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [form, setForm] = useState<CohortForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cohortsRes, facsRes] = await Promise.all([
        selectedProgramId
          ? apiClient.get<Cohort[]>(`/catalog/programs/${selectedProgramId}/cohorts`)
          : apiClient.get<Cohort[]>('/catalog/cohorts'),
        apiClient.get<Faculty[]>('/catalog/faculties'),
      ]);
      setCohorts(Array.isArray(cohortsRes) ? cohortsRes : []);
      setFaculties(Array.isArray(facsRes) ? facsRes : []);
    } catch {
      setError('Failed to load cohorts');
    } finally {
      setLoading(false);
    }
  }, [selectedProgramId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchPrograms = useCallback(async (facultyId: string) => {
    try {
      const res = await apiClient.get<Program[]>(facultyId
        ? `/catalog/faculties/${facultyId}/programs`
        : '/catalog/programs'
      );
      setPrograms(Array.isArray(res) ? res : []);
    } catch {
      setPrograms([]);
    }
  }, []);

  useEffect(() => {
    fetchPrograms(selectedFacultyId);
  }, [selectedFacultyId, fetchPrograms]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (editingCohort) {
        await apiClient.put(`/catalog/cohorts/${editingCohort.id}`, payload);
      } else {
        await apiClient.post('/catalog/cohorts', payload);
      }
      setDialogOpen(false);
      setEditingCohort(null);
      setForm(emptyForm);
      fetchData();
    } catch {
      setError('Failed to save cohort');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/catalog/cohorts/${deleteTarget.id}`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch {
      setError('Failed to delete cohort');
    }
  };

  const openEditDialog = (cohort: Cohort) => {
    setEditingCohort(cohort);
    setForm({
      name: cohort.name,
      programId: cohort.programId ?? '',
      startDate: cohort.startDate ? cohort.startDate.slice(0, 10) : '',
      endDate: cohort.endDate ? cohort.endDate.slice(0, 10) : '',
    });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingCohort(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const getProgramName = (programId: string) =>
    programs.find((p) => p.id === programId)?.name ?? programId;

  const onFacultyChange = (facultyId: string) => {
    setSelectedFacultyId(facultyId);
    setSelectedProgramId('');
    setForm({ ...form, programId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cohorts</h1>
        <Button onClick={openNewDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Cohort
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="shrink-0">Faculty:</Label>
          <Select value={selectedFacultyId} onValueChange={onFacultyChange}>
            <SelectTrigger className="w-56">
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
        <div className="flex items-center gap-2">
          <Label className="shrink-0">Program:</Label>
          <Select value={selectedProgramId} onValueChange={(v) => setSelectedProgramId(v)}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="All Programs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                <th className="text-left p-4 font-medium text-muted-foreground">Program</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Start Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">End Date</th>
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
              ) : cohorts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No cohorts found</td>
                </tr>
              ) : (
                cohorts.map((cohort) => (
                  <tr key={cohort.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{cohort.name}</td>
                    <td className="p-4 text-sm">{getProgramName(cohort.programId)}</td>
                    <td className="p-4 text-sm">{cohort.startDate ? new Date(cohort.startDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-sm">{cohort.endDate ? new Date(cohort.endDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">
                      <Badge variant={cohort.isActive !== false ? 'default' : 'secondary'}>
                        {cohort.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(cohort)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget(cohort); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
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
            <DialogTitle>{editingCohort ? 'Edit Cohort' : 'New Cohort'}</DialogTitle>
            <DialogDescription>Fill in the cohort details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cohName">Name</Label>
              <Input id="cohName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cohProgram">Program</Label>
              <Select value={form.programId} onValueChange={(v) => setForm({ ...form, programId: v })}>
                <SelectTrigger id="cohProgram">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cohStart">Start Date</Label>
              <Input id="cohStart" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cohEnd">End Date</Label>
              <Input id="cohEnd" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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
            <DialogTitle>Delete Cohort</DialogTitle>
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
