import { Module } from '@nestjs/common';
import { CampaignUseCase } from './application/use-cases';
import { CAMPAIGN_REPOSITORY_PORT } from './application/ports';
import { PrismaCampaignRepositoryAdapter } from './infrastructure/adapters';
import { CampaignController } from './interface/controllers';
@Module({ controllers: [CampaignController], providers: [{ provide: CAMPAIGN_REPOSITORY_PORT, useClass: PrismaCampaignRepositoryAdapter }, CampaignUseCase], exports: [CampaignUseCase] })
export class CampaignsModule {}
