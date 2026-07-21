import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CatalogRepositoryPort } from '../../application/ports';
import { Faculty, Program, Cohort } from '../../domain';

@Injectable()
export class PrismaCatalogRepositoryAdapter implements CatalogRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAllFaculties(): Promise<Faculty[]> {
    const faculties = await this.prisma.faculty.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    return faculties.map(f => this.toFaculty(f));
  }

  async findFacultyById(id: string): Promise<Faculty | null> {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    return f ? this.toFaculty(f) : null;
  }

  async createFaculty(data: { name: string; code: string; description?: string }): Promise<Faculty> {
    const f = await this.prisma.faculty.create({ data });
    return this.toFaculty(f);
  }

  async updateFaculty(id: string, data: any): Promise<Faculty> {
    const f = await this.prisma.faculty.update({ where: { id }, data });
    return this.toFaculty(f);
  }

  async deleteFaculty(id: string): Promise<void> {
    await this.prisma.faculty.delete({ where: { id } });
  }

  async findProgramsByFacultyId(facultyId: string): Promise<Program[]> {
    const programs = await this.prisma.program.findMany({ where: { facultyId, isActive: true }, orderBy: { name: 'asc' } });
    return programs.map(p => this.toProgram(p));
  }

  async findProgramById(id: string): Promise<Program | null> {
    const p = await this.prisma.program.findUnique({ where: { id } });
    return p ? this.toProgram(p) : null;
  }

  async createProgram(data: any): Promise<Program> {
    const p = await this.prisma.program.create({ data });
    return this.toProgram(p);
  }

  async updateProgram(id: string, data: any): Promise<Program> {
    const p = await this.prisma.program.update({ where: { id }, data });
    return this.toProgram(p);
  }

  async deleteProgram(id: string): Promise<void> {
    await this.prisma.program.delete({ where: { id } });
  }

  async findCohortsByProgramId(programId: string): Promise<Cohort[]> {
    const cohorts = await this.prisma.cohort.findMany({ where: { programId, isActive: true }, orderBy: { startDate: 'desc' } });
    return cohorts.map(c => this.toCohort(c));
  }

  async findCohortById(id: string): Promise<Cohort | null> {
    const c = await this.prisma.cohort.findUnique({ where: { id } });
    return c ? this.toCohort(c) : null;
  }

  async createCohort(data: any): Promise<Cohort> {
    const c = await this.prisma.cohort.create({ data });
    return this.toCohort(c);
  }

  async updateCohort(id: string, data: any): Promise<Cohort> {
    const c = await this.prisma.cohort.update({ where: { id }, data });
    return this.toCohort(c);
  }

  async deleteCohort(id: string): Promise<void> {
    await this.prisma.cohort.delete({ where: { id } });
  }

  private toFaculty(f: any): Faculty {
    return new Faculty(f.id, f.name, f.code, f.description, f.isActive, f.createdAt, f.updatedAt);
  }

  private toProgram(p: any): Program {
    return new Program(p.id, p.facultyId, p.name, p.code, p.description, p.durationMonths, p.isActive, p.createdAt, p.updatedAt);
  }

  private toCohort(c: any): Cohort {
    return new Cohort(c.id, c.programId, c.name, c.startDate, c.endDate, c.isActive, c.createdAt, c.updatedAt);
  }
}
