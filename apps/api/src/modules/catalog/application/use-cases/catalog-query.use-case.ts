import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REPOSITORY_PORT, CatalogRepositoryPort, CATALOG_CACHE_PORT, CatalogCachePort } from '../ports';
import { Faculty, Program, Cohort } from '../../domain';

@Injectable()
export class CatalogQueryUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_PORT) private readonly repo: CatalogRepositoryPort,
    @Inject(CATALOG_CACHE_PORT) private readonly cache: CatalogCachePort,
  ) {}

  async getAllFaculties(): Promise<Faculty[]> {
    const cached = await this.cache.get<Faculty[]>('catalog:faculties');
    if (cached) return cached;
    const faculties = await this.repo.findAllFaculties();
    await this.cache.set('catalog:faculties', faculties, 300);
    return faculties;
  }

  async getFacultyById(id: string): Promise<Faculty | null> {
    return this.repo.findFacultyById(id);
  }

  async getProgramsByFaculty(facultyId: string): Promise<Program[]> {
    const cached = await this.cache.get<Program[]>(`catalog:programs:${facultyId}`);
    if (cached) return cached;
    const programs = await this.repo.findProgramsByFacultyId(facultyId);
    await this.cache.set(`catalog:programs:${facultyId}`, programs, 300);
    return programs;
  }

  async getProgramById(id: string): Promise<Program | null> {
    return this.repo.findProgramById(id);
  }

  async getCohortsByProgram(programId: string): Promise<Cohort[]> {
    const cached = await this.cache.get<Cohort[]>(`catalog:cohorts:${programId}`);
    if (cached) return cached;
    const cohorts = await this.repo.findCohortsByProgramId(programId);
    await this.cache.set(`catalog:cohorts:${programId}`, cohorts, 300);
    return cohorts;
  }

  async getCohortById(id: string): Promise<Cohort | null> {
    return this.repo.findCohortById(id);
  }
}
