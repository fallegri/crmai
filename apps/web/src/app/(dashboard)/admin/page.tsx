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
import { Search, Plus, Check, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  roles: { id: string; name: string; description: string | null }[];
}

interface AdminRole {
  id: string;
  name: string;
  description: string | null;
  _count: { userRoles: number };
}

interface PaginatedUsers {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const limit = 20;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', password: '', firstName: '', lastName: '', roleId: '' });
  const [creating, setCreating] = useState(false);

  const [editRolesDialogOpen, setEditRolesDialogOpen] = useState(false);
  const [editRolesTarget, setEditRolesTarget] = useState<AdminUser | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, limit };
      if (tab === 'pending') params.status = 'INACTIVE';
      else if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await apiClient.get<PaginatedUsers>('/admin/users', params);
      setUsers(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, tab]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await apiClient.get<AdminRole[]>('/admin/roles');
      setRoles(Array.isArray(res) ? res : []);
    } catch {}
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const totalPages = Math.ceil(total / limit);

  const handleApprove = async (userId: string) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { status: 'ACTIVE' });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'ACTIVE' } : u));
    } catch {
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      setError('Failed to reject user');
    }
  };

  const handleCreateUser = async () => {
    setCreating(true);
    try {
      const payload: any = { email: createForm.email, password: createForm.password, firstName: createForm.firstName, lastName: createForm.lastName };
      if (createForm.roleId) payload.roleId = createForm.roleId;
      await apiClient.post('/admin/users', payload);
      setCreateDialogOpen(false);
      setCreateForm({ email: '', password: '', firstName: '', lastName: '', roleId: '' });
      fetchUsers();
    } catch {
      setError('Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const openEditRolesDialog = (user: AdminUser) => {
    setEditRolesTarget(user);
    setSelectedRoleIds(user.roles.map(r => r.id));
    setEditRolesDialogOpen(true);
  };

  const handleSaveRoles = async () => {
    if (!editRolesTarget) return;
    setSavingRoles(true);
    try {
      await apiClient.put(`/admin/users/${editRolesTarget.id}/roles`, { roleIds: selectedRoleIds });
      setEditRolesDialogOpen(false);
      setEditRolesTarget(null);
      fetchUsers();
    } catch {
      setError('Failed to update roles');
    } finally {
      setSavingRoles(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
    );
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      BLOCKED: 'destructive',
    };
    const labels: Record<string, string> = {
      ACTIVE: 'Activo',
      INACTIVE: 'Pendiente',
      BLOCKED: 'Bloqueado',
    };
    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
  };

  const pendingCount = users.filter(u => u.status === 'INACTIVE').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Usuario
        </Button>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <Button variant={tab === 'pending' ? 'default' : 'ghost'} size="sm" onClick={() => { setTab('pending'); setPage(1); }}>
          Pendientes {pendingCount > 0 && <Badge variant="secondary" className="ml-2">{pendingCount}</Badge>}
        </Button>
        <Button variant={tab === 'all' ? 'default' : 'ghost'} size="sm" onClick={() => { setTab('all'); setPage(1); }}>
          Todos los Usuarios
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar usuarios..." className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        {tab === 'all' && (
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todos</SelectItem>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Pendiente</SelectItem>
              <SelectItem value="BLOCKED">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        )}
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
                <th className="text-left p-4 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Estado</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Roles</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Creado</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-muted animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {tab === 'pending' ? 'No hay usuarios pendientes de aprobación' : 'No se encontraron usuarios'}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4">{statusBadge(user.status)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="text-xs text-muted-foreground">Sin rol</span>
                        ) : (
                          user.roles.map(r => (
                            <Badge key={r.id} variant="outline" className="text-xs">{r.name}</Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {user.status === 'INACTIVE' && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleApprove(user.id)} title="Aprobar">
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReject(user.id)} title="Rechazar">
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEditRolesDialog(user)} title="Cambiar roles">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleReject(user.id)} title="Eliminar">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Siguiente <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
            <DialogDescription>Crear un nuevo usuario con rol específico.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" value={createForm.firstName} onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" value={createForm.lastName} onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={createForm.roleId} onValueChange={(v) => setCreateForm({ ...createForm, roleId: v })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCreateUser} disabled={creating}>{creating ? 'Creando...' : 'Crear'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editRolesDialogOpen} onOpenChange={setEditRolesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Roles de {editRolesTarget?.firstName} {editRolesTarget?.lastName}</DialogTitle>
            <DialogDescription>Selecciona los roles del usuario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {roles.map((role) => {
              const isSelected = selectedRoleIds.includes(role.id);
              return (
                <div key={role.id} className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-accent" onClick={() => toggleRole(role.id)}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleRole(role.id)} className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{role.name}</p>
                    {role.description && <p className="text-xs text-muted-foreground">{role.description}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{role._count.userRoles} usuarios</span>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSaveRoles} disabled={savingRoles}>{savingRoles ? 'Guardando...' : 'Guardar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
