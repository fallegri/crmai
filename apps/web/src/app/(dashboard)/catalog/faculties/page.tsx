'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import type { Faculty } from '@/lib/types';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

interface FacultyForm {
  name: string;
  code: string;
  description: string;
}

const emptyForm: FacultyForm = { name: '', code: '', description: '' };

export default function FacultiesPage() {
  const router = useRouter();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Faculty | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [form, setForm] = useState<FacultyForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchFaculties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<Faculty[]>('/catalog/faculties');
      setFaculties(Array.isArray(res) ? res : []);
    } catch {
      setError('Failed to load faculties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaculties(); }, [fetchFaculties]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingFaculty) {
        await apiClient.put(`/catalog/faculties/${editingFaculty.id}`, form);
      } else {
        await apiClient.post('/catalog/faculties', form);
      }
      setDialogOpen(false);
      setEditingFaculty(null);
      setForm(emptyForm);
      fetchFaculties();
    } catch {
      setError('Failed to save faculty');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/catalog/faculties/${deleteTarget.id}`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchFaculties();
    } catch {
      setError('Failed to delete faculty');
    }
  };

  const openEditDialog = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setForm({ name: faculty.name, code: faculty.code ?? '', description: faculty.description ?? '' });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingFaculty(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Faculties</h1>
        <Button onClick={openNewDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Faculty
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
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Code</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Active</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-muted animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : faculties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No faculties found</td>
                </tr>
              ) : (
                faculties.map((faculty) => (
                  <tr key={faculty.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{faculty.name}</td>
                    <td className="p-4 text-sm">{faculty.code}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{faculty.description}</td>
                    <td className="p-4">
                      <Badge variant={faculty.isActive !== false ? 'default' : 'secondary'}>
                        {faculty.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(faculty)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget(faculty); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push('/catalog/programs')}>
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
            <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'New Faculty'}</DialogTitle>
            <DialogDescription>Fill in the faculty details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
            <DialogTitle>Delete Faculty</DialogTitle>
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
