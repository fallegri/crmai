import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { OpportunityRepositoryPort } from '../../application/ports';
import { Opportunity, OpportunityStatus, PipelineStage, Enrollment } from '../../domain';

@Injectable()
export class PrismaOpportunityRepositoryAdapter implements OpportunityRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<Opportunity> {
    const stages = await this.findAllStages();
    const defaultStage = stages.find(s => s.position === 0) || stages[0];
    const opp = await this.prisma.opportunity.create({
      data: {
        contactId: data.contactId,
        programId: data.programId,
        cohortId: data.cohortId || null,
        currentStageId: defaultStage?.id || '',
        source: data.source || null,
        assignedAdvisorId: data.assignedAdvisorId || null,
        notes: data.notes || null,
      },
    });
    return this.toDomain(opp);
  }

  async findById(id: string): Promise<Opportunity | null> {
    const opp = await this.prisma.opportunity.findUnique({ where: { id } });
    return opp ? this.toDomain(opp) : null;
  }

  async findByContactId(contactId: string): Promise<Opportunity[]> {
    const opps = await this.prisma.opportunity.findMany({ where: { contactId }, orderBy: { createdAt: 'desc' } });
    return opps.map(o => this.toDomain(o));
  }

  async findAll(page = 1, limit = 20, stageId?: string, advisorId?: string): Promise<{ opportunities: Opportunity[]; total: number }> {
    const where: any = {};
    if (stageId) where.currentStageId = stageId;
    if (advisorId) where.assignedAdvisorId = advisorId;
    const skip = (page - 1) * limit;
    const [opportunities, total] = await Promise.all([
      this.prisma.opportunity.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.opportunity.count({ where }),
    ]);
    return { opportunities: opportunities.map(o => this.toDomain(o)), total };
  }

  async updateStage(opportunityId: string, stageId: string): Promise<Opportunity> {
    const opp = await this.prisma.opportunity.update({ where: { id: opportunityId }, data: { currentStageId: stageId } });
    return this.toDomain(opp);
  }

  async assignAdvisor(opportunityId: string, advisorId: string): Promise<Opportunity> {
    const opp = await this.prisma.opportunity.update({ where: { id: opportunityId }, data: { assignedAdvisorId: advisorId } });
    return this.toDomain(opp);
  }

  async updateStatus(opportunityId: string, status: string): Promise<Opportunity> {
    const opp = await this.prisma.opportunity.update({ where: { id: opportunityId }, data: { status: status as any } });
    return this.toDomain(opp);
  }

  async findAllStages(): Promise<PipelineStage[]> {
    const stages = await this.prisma.pipelineStage.findMany({ orderBy: { position: 'asc' } });
    return stages.map(s => new PipelineStage(s.id, s.name, s.position, s.isTerminal, s.color, s.createdAt, s.updatedAt));
  }

  async createStage(data: any): Promise<PipelineStage> {
    const s = await this.prisma.pipelineStage.create({ data });
    return new PipelineStage(s.id, s.name, s.position, s.isTerminal, s.color, s.createdAt, s.updatedAt);
  }

  async updateStage(id: string, data: any): Promise<PipelineStage> {
    const s = await this.prisma.pipelineStage.update({ where: { id }, data });
    return new PipelineStage(s.id, s.name, s.position, s.isTerminal, s.color, s.createdAt, s.updatedAt);
  }

  async deleteStage(id: string): Promise<void> {
    await this.prisma.pipelineStage.delete({ where: { id } });
  }

  async createEnrollment(data: any): Promise<Enrollment> {
    const e = await this.prisma.enrollment.create({ data: { opportunityId: data.opportunityId, evidenceUrl: data.evidenceUrl || null, notes: data.notes || null, enrolledBy: data.enrolledBy } });
    return new Enrollment(e.id, e.opportunityId, e.enrollmentDate, e.evidenceUrl, e.notes, e.enrolledBy, e.createdAt);
  }

  async findEnrollmentsByOpportunityId(opportunityId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({ where: { opportunityId }, orderBy: { createdAt: 'desc' } });
    return enrollments.map(e => new Enrollment(e.id, e.opportunityId, e.enrollmentDate, e.evidenceUrl, e.notes, e.enrolledBy, e.createdAt));
  }

  private toDomain(o: any): Opportunity {
    return new Opportunity(o.id, o.contactId, o.programId, o.cohortId, o.currentStageId, o.assignedAdvisorId, o.source, o.status as OpportunityStatus, o.notes, o.createdAt, o.updatedAt);
  }
}
