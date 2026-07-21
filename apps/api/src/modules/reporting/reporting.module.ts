import { Module } from '@nestjs/common';
import { ReportingUseCase } from './application/use-cases';
import { REPORT_REPOSITORY_PORT } from './application/ports';
import { PrismaReportRepositoryAdapter } from './infrastructure/adapters';
import { ReportingController } from './interface/controllers';
@Module({ controllers: [ReportingController], providers: [{ provide: REPORT_REPOSITORY_PORT, useClass: PrismaReportRepositoryAdapter }, ReportingUseCase], exports: [ReportingUseCase] })
export class ReportingModule {}
