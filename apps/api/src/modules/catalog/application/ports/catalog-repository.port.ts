import { Faculty, Program, Cohort } from '../../domain';

export const CATALOG_REPOSITORY_PORT = 'CatalogRepositoryPort';

export interface CatalogRepositoryPort {
  findAllFaculties(): Promise<Faculty[]>;
  findFacultyById(id: string): Promise<Faculty | null>;
  createFaculty(data: { name: string; code: string; description?: string }): Promise<Faculty>;
  updateFaculty(id: string, data: { name?: string; code?: string; description?: string; isActive?: boolean }): Promise<Faculty>;
  deleteFaculty(id: string): Promise<void>;
  findProgramsByFacultyId(facultyId: string): Promise<Program[]>;
  findProgramById(id: string): Promise<Program | null>;
  createProgram(data: { facultyId: string; name: string; code: string; description?: string; durationMonths: number }): Promise<Program>;
  updateProgram(id: string, data: { name?: string; code?: string; description?: string; durationMonths?: number; isActive?: boolean }): Promise<Program>;
  deleteProgram(id: string): Promise<void>;
  findCohortsByProgramId(programId: string): Promise<Cohort[]>;
  findCohortById(id: string): Promise<Cohort | null>;
  createCohort(data: { programId: string; name: string; startDate: Date; endDate: Date }): Promise<Cohort>;
  updateCohort(id: string, data: { name?: string; startDate?: Date; endDate?: Date; isActive?: boolean }): Promise<Cohort>;
  deleteCohort(id: string): Promise<void>;
}
