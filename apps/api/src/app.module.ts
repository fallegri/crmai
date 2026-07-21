import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { IdentityModule } from './modules/identity/identity.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    IdentityModule,
    CatalogModule,
    ContactsModule,
    ActivitiesModule,
    AgendaModule,
    AutomationsModule,
    CampaignsModule,
    ReportingModule,
    DocumentsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
