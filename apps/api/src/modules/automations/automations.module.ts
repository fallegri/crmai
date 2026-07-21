import { Module } from '@nestjs/common';
import { AutomationUseCase } from './application/use-cases';
import { AUTOMATION_REPOSITORY_PORT } from './application/ports';
import { PrismaAutomationRepositoryAdapter } from './infrastructure/adapters';
import { AutomationController } from './interface/controllers';
@Module({ controllers: [AutomationController], providers: [{ provide: AUTOMATION_REPOSITORY_PORT, useClass: PrismaAutomationRepositoryAdapter }, AutomationUseCase], exports: [AutomationUseCase] })
export class AutomationsModule {}
