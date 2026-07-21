import { Opportunity, PipelineStage, Enrollment } from '../../domain';

export const OPPORTUNITY_REPOSITORY_PORT = 'OpportunityRepositoryPort';

export interface OpportunityRepositoryPort {
  create(data: { contactId: string; programId: string; cohortId?: string; source?: string; assignedAdvisorId?: string; notes?: string }): Promise<Opportunity>;
  findById(id: string): Promise<Opportunity | null>;
  findByContactId(contactId: string): Promise<Opportunity[]>;
  findAll(page?: number, limit?: number, stageId?: string, advisorId?: string): Promise<{ opportunities: Opportunity[]; total: number }>;
  updateStage(opportunityId: string, stageId: string): Promise<Opportunity>;
  assignAdvisor(opportunityId: string, advisorId: string): Promise<Opportunity>;
  updateStatus(opportunityId: string, status: string): Promise<Opportunity>;
  findAllStages(): Promise<PipelineStage[]>;
  createStage(data: { name: string; position: number; isTerminal?: boolean; color?: string }): Promise<PipelineStage>;
  updatePipelineStage(id: string, data: { name?: string; position?: number; isTerminal?: boolean; color?: string }): Promise<PipelineStage>;
  deleteStage(id: string): Promise<void>;
  createEnrollment(data: { opportunityId: string; evidenceUrl?: string; notes?: string; enrolledBy: string }): Promise<Enrollment>;
  findEnrollmentsByOpportunityId(opportunityId: string): Promise<Enrollment[]>;
}
