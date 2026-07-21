import { Module } from '@nestjs/common';
import { AgendaUseCase } from './application/use-cases';
import { AGENDA_REPOSITORY_PORT } from './application/ports';
import { PrismaAgendaRepositoryAdapter } from './infrastructure/adapters';
import { AgendaController } from './interface/controllers';

@Module({
  controllers: [AgendaController],
  providers: [
    {
      provide: AGENDA_REPOSITORY_PORT,
      useClass: PrismaAgendaRepositoryAdapter,
    },
    AgendaUseCase,
  ],
  exports: [AgendaUseCase],
})
export class AgendaModule {}
