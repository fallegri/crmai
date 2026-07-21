import { Module } from '@nestjs/common';
import { ActivityUseCase } from './application/use-cases';
import { ACTIVITY_REPOSITORY_PORT } from './application/ports';
import { PrismaActivityRepositoryAdapter } from './infrastructure/adapters';
import { ActivityController } from './interface/controllers';

@Module({
  controllers: [ActivityController],
  providers: [
    { provide: ACTIVITY_REPOSITORY_PORT, useClass: PrismaActivityRepositoryAdapter },
    ActivityUseCase,
  ],
  exports: [ActivityUseCase],
})
export class ActivitiesModule {}
