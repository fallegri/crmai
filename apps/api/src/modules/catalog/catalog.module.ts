import { Module } from '@nestjs/common';
import { CatalogQueryUseCase, CatalogAdminUseCase } from './application/use-cases';
import { CATALOG_REPOSITORY_PORT, CATALOG_CACHE_PORT } from './application/ports';
import { PrismaCatalogRepositoryAdapter, RedisCatalogCacheAdapter } from './infrastructure/adapters';
import { CatalogController } from './interface/controllers';

@Module({
  controllers: [CatalogController],
  providers: [
    { provide: CATALOG_REPOSITORY_PORT, useClass: PrismaCatalogRepositoryAdapter },
    { provide: CATALOG_CACHE_PORT, useClass: RedisCatalogCacheAdapter },
    CatalogQueryUseCase,
    CatalogAdminUseCase,
  ],
  exports: [CatalogQueryUseCase, CatalogAdminUseCase],
})
export class CatalogModule {}
