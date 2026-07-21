import { Module } from '@nestjs/common';
import { DocumentUseCase } from './application/use-cases';
import { DOCUMENT_REPOSITORY_PORT } from './application/ports';
import { PrismaDocumentRepositoryAdapter } from './infrastructure/adapters';
import { DocumentController } from './interface/controllers';
@Module({ controllers: [DocumentController], providers: [{ provide: DOCUMENT_REPOSITORY_PORT, useClass: PrismaDocumentRepositoryAdapter }, DocumentUseCase], exports: [DocumentUseCase] })
export class DocumentsModule {}
