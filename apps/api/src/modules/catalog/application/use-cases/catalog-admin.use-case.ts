import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATALOG_REPOSITORY_PORT, CatalogRepositoryPort, CATALOG_CACHE_PORT, CatalogCachePort } from '../ports';
import { Faculty, Program, Cohort } from '../../domain';

@Injectable()
export class CatalogAdminUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_PORT) private readonly repo: CatalogRepositoryPort,
    @Inject(CATALOG_CACHE_PORT) private readonly cache: CatalogCachePort,
  ) {}

  async createFaculty(data: { name: string; code: string; description?: string }): Promise<Faculty> {
    const faculty = await this.repo.createFaculty(data);
    await this.cache.invalidate('catalog:faculties');
    return faculty;
  }

  async updateFaculty(id: string, data: { name?: string; code?: string; description?: string; isActive?: boolean }): Promise<Faculty> {
    const faculty = await this.repo.findFacultyById(id);
    if (!faculty) throw new NotFoundException('Faculty not found');
    const updated = await this.repo.updateFaculty(id, data);
    await this.cache.invalidate('catalog:faculties');
    return updated;
  }

  async deleteFaculty(id: string): Promise<void> {
    await this.repo.deleteFaculty(id);
    await this.cache.invalidate('catalog:faculties');
  }

  async createProgram(data: { facultyId: string; name: string; code: string; description?: string; durationMonths: number }): Promise<Program> {
    const program = await this.repo.createProgram(data);
    await this.cache.invalidate(`catalog:programs:${data.facultyId}`);
    return program;
  }

  async updateProgram(id: string, data: { name?: string; code?: string; description?: string; durationMonths?: number; isActive?: boolean }): Promise<Program> {
    const program = await this.repo.findProgramById(id);
    if (!program) throw new NotFoundException('Program not found');
    const updated = await this.repo.updateProgram(id, data);
    await this.cache.invalidate(`catalog:programs:${program.facultyId}`);
    return updated;
  }

  async deleteProgram(id: string): Promise<void> {
    const program = await this.repo.findProgramById(id);
    if (program) {
      await this.repo.deleteProgram(id);
      await this.cache.invalidate(`catalog:programs:${program.facultyId}`);
    }
  }

  async createCohort(data: { programId: string; name: string; startDate: Date; endDate: Date }): Promise<Cohort> {
    const cohort = await this.repo.createCohort(data);
    await this.cache.invalidate(`catalog:cohorts:${data.programId}`);
    return cohort;
  }

  async updateCohort(id: string, data: { name?: string; startDate?: Date; endDate?: Date; isActive?: boolean }): Promise<Cohort> {
    const cohort = await this.repo.findCohortById(id);
    if (!cohort) throw new NotFoundException('Cohort not found');
    const updated = await this.repo.updateCohort(id, data);
    await this.cache.invalidate(`catalog:cohorts:${cohort.programId}`);
    return updated;
  }

  async deleteCohort(id: string): Promise<void> {
    const cohort = await this.repo.findCohortById(id);
    if (cohort) {
      await this.repo.deleteCohort(id);
      await this.cache.invalidate(`catalog:cohorts:${cohort.programId}`);
    }
  }
}
