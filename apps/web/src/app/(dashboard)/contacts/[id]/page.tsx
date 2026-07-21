'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import type { Contact, Opportunity, ActivityEvent, Document } from '@/lib/types';
import { ArrowLeft, Mail, Phone, User, FileText, Calendar, Activity, Download } from 'lucide-react';

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contactRes, oppsRes, actsRes, docsRes] = await Promise.all([
          apiClient.get<Contact>(`/contacts/${id}`),
          apiClient.get<Opportunity[]>(`/contacts/${id}/opportunities`).catch(() => []),
          apiClient.get<ActivityEvent[]>(`/activities/contact/${id}`).catch(() => []),
          apiClient.get<Document[]>(`/documents/contact/${id}`).catch(() => []),
        ]);
        setContact(contactRes);
        setOpportunities(Array.isArray(oppsRes) ? oppsRes : []);
        setActivities(Array.isArray(actsRes) ? actsRes : []);
        setDocuments(Array.isArray(docsRes) ? docsRes : []);
      } catch {
        setError('Failed to load contact details');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse"><CardContent className="h-48" /></Card>
          <Card className="animate-pulse md:col-span-2"><CardContent className="h-48" /></Card>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <Card className="w-96 mx-auto mt-12">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive mb-4">{error || 'Contact not found'}</p>
          <Button onClick={() => router.push('/contacts')}>Back to Contacts</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/contacts')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contacts
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {contact.firstName} {contact.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {contact.email || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {contact.phone || 'N/A'}
            </div>
            {contact.source && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Source:</span>
                <Badge variant="outline" className="capitalize">{contact.source}</Badge>
              </div>
            )}
            {contact.notes && (
              <p className="text-sm text-muted-foreground mt-2">{contact.notes}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Linked Opportunities ({opportunities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {opportunities.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No linked opportunities</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Program</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Stage</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="border-b last:border-0">
                      <td className="p-4 text-sm">{opp.programId ?? 'N/A'}</td>
                      <td className="p-4 text-sm">{opp.currentStage?.name ?? opp.currentStageId}</td>
                      <td className="p-4">
                        <Badge variant={opp.status === 'WON' ? 'default' : opp.status === 'LOST' ? 'destructive' : 'secondary'}>
                          {opp.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(opp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activities recorded</p>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 border-l-2 border-muted pl-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{act.title}</p>
                      {act.description && <p className="text-xs text-muted-foreground">{act.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(act.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {act.type && <Badge variant="outline" className="text-xs">{act.type}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents attached</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.fileType} {(doc.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
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
