'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import type { PipelineStage, Opportunity } from '@/lib/types';
import { Plus, Settings, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [stageForm, setStageForm] = useState({ name: '', color: '#3b82f6' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [stagesRes, oppsRes] = await Promise.all([
          apiClient.get<PipelineStage[]>('/pipeline/stages'),
          apiClient.get<Opportunity[]>('/opportunities', { limit: 100 }),
        ]);
        setStages(Array.isArray(stagesRes) ? stagesRes : []);
        setOpportunities(Array.isArray(oppsRes) ? oppsRes : []);
      } catch {
        setError('Failed to load pipeline data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoveStage = async (oppId: string, newStageId: string) => {
    try {
      await apiClient.post(`/opportunities/${oppId}/move/${newStageId}`);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, currentStageId: newStageId } : o))
      );
    } catch {
      setError('Failed to move opportunity');
    }
  };

  const handleSaveStage = async () => {
    try {
      if (editingStage) {
        await apiClient.put(`/pipeline/stages/${editingStage.id}`, stageForm);
      } else {
        await apiClient.post('/pipeline/stages', stageForm);
      }
      setStageDialogOpen(false);
      setEditingStage(null);
      setStageForm({ name: '', color: '#3b82f6' });
      const res = await apiClient.get<PipelineStage[]>('/pipeline/stages');
      setStages(Array.isArray(res) ? res : []);
    } catch {
      setError('Failed to save stage');
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      await apiClient.delete(`/pipeline/stages/${stageId}`);
      setStages((prev) => prev.filter((s) => s.id !== stageId));
    } catch {
      setError('Failed to delete stage');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Pipeline</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="min-w-72 flex-1 animate-pulse">
              <CardContent className="h-96" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-96 mx-auto mt-12">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const getOppsByStage = (stageId: string) =>
    opportunities.filter((o) => o.currentStageId === stageId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pipeline</h1>
        <Button
          variant="outline"
          onClick={() => {
            setEditingStage(null);
            setStageForm({ name: '', color: '#3b82f6' });
            setStageDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Stage
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-72 flex-1">
            <Card>
              <CardHeader
                className="py-3"
                style={{ borderTop: `4px solid ${stage.color}` }}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {stage.name}
                    <Badge variant="secondary" className="text-xs">
                      {getOppsByStage(stage.id).length}
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingStage(stage);
                        setStageForm({ name: stage.name, color: stage.color ?? '#3b82f6' });
                        setStageDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                {getOppsByStage(stage.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No opportunities</p>
                ) : (
                  getOppsByStage(stage.id).map((opp) => (
                    <Card
                      key={opp.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => { setSelectedOpp(opp); setDetailOpen(true); }}
                    >
                      <CardContent className="p-3 space-y-1">
                        <p className="text-sm font-medium">{opp.contact?.firstName ?? 'Unknown'} {opp.contact?.lastName ?? ''}</p>
                        <p className="text-xs text-muted-foreground">{opp.programId ?? 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">
                          {opp.assignedAdvisorId ?? 'No advisor'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(opp.createdAt).toLocaleDateString()}
                        </p>
                        <Select
                          value={opp.currentStageId}
                          onValueChange={(v) => handleMoveStage(opp.id, v)}
                        >
                          <SelectTrigger className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opportunity Details</DialogTitle>
          </DialogHeader>
          {selectedOpp && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact</Label>
                  <p className="text-sm">{selectedOpp.contact?.firstName} {selectedOpp.contact?.lastName}</p>
                </div>
                <div>
                  <Label>Program</Label>
                  <p className="text-sm">{selectedOpp.programId ?? 'N/A'}</p>
                </div>
                <div>
                  <Label>Stage</Label>
                  <p className="text-sm">{stages.find((s) => s.id === selectedOpp.currentStageId)?.name ?? selectedOpp.currentStageId}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedOpp.status === 'WON' ? 'default' : selectedOpp.status === 'LOST' ? 'destructive' : 'secondary'}>
                    {selectedOpp.status}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm">{new Date(selectedOpp.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedOpp.notes && (
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <p className="text-sm text-muted-foreground">{selectedOpp.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stageDialogOpen} onOpenChange={setStageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStage ? 'Edit Stage' : 'New Stage'}</DialogTitle>
            <DialogDescription>Configure the pipeline stage details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stageName">Name</Label>
              <Input id="stageName" value={stageForm.name} onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stageColor">Color</Label>
              <div className="flex items-center gap-2">
                <Input id="stageColor" type="color" value={stageForm.color} onChange={(e) => setStageForm({ ...stageForm, color: e.target.value })} className="w-16 h-10 p-1" />
                <span className="text-sm text-muted-foreground">{stageForm.color}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveStage}>{editingStage ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
