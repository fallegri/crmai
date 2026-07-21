import { Module } from '@nestjs/common';
import { ContactUseCase, OpportunityUseCase, PipelineUseCase, AssignmentUseCase, EnrollmentUseCase } from './application/use-cases';
import { CONTACT_REPOSITORY_PORT, OPPORTUNITY_REPOSITORY_PORT, ASSIGNMENT_STRATEGY_PORT, DEDUPLICATION_PORT } from './application/ports';
import { PrismaContactRepositoryAdapter, PrismaOpportunityRepositoryAdapter, RoundRobinAssignmentStrategy, BasicDeduplicationAdapter } from './infrastructure/adapters';
import { ContactController, OpportunityController, PipelineController } from './interface/controllers';

@Module({
  controllers: [ContactController, OpportunityController, PipelineController],
  providers: [
    { provide: CONTACT_REPOSITORY_PORT, useClass: PrismaContactRepositoryAdapter },
    { provide: OPPORTUNITY_REPOSITORY_PORT, useClass: PrismaOpportunityRepositoryAdapter },
    { provide: ASSIGNMENT_STRATEGY_PORT, useClass: RoundRobinAssignmentStrategy },
    { provide: DEDUPLICATION_PORT, useClass: BasicDeduplicationAdapter },
    ContactUseCase,
    OpportunityUseCase,
    PipelineUseCase,
    AssignmentUseCase,
    EnrollmentUseCase,
  ],
  exports: [ContactUseCase, OpportunityUseCase, PipelineUseCase, AssignmentUseCase],
})
export class ContactsModule {}
