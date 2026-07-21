import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CatalogQueryUseCase, CatalogAdminUseCase } from '../../application/use-cases';
import { JwtAuthGuard, PermissionsGuard, RequirePermission } from '../../../identity/interface';
import { CreateFacultyDto, UpdateFacultyDto, CreateProgramDto, CreateCohortDto } from '../dto';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly query: CatalogQueryUseCase,
    private readonly admin: CatalogAdminUseCase,
  ) {}

  @Get('faculties')
  @ApiOperation({ summary: 'List all active faculties' })
  async getAllFaculties() {
    return this.query.getAllFaculties();
  }

  @Get('faculties/:id')
  @ApiOperation({ summary: 'Get faculty by ID' })
  async getFacultyById(@Param('id') id: string) {
    return this.query.getFacultyById(id);
  }

  @Post('faculties')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new faculty' })
  async createFaculty(@Body() dto: CreateFacultyDto) {
    return this.admin.createFaculty(dto);
  }

  @Put('faculties/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a faculty' })
  async updateFaculty(@Param('id') id: string, @Body() dto: UpdateFacultyDto) {
    return this.admin.updateFaculty(id, dto);
  }

  @Delete('faculties/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a faculty' })
  async deleteFaculty(@Param('id') id: string) {
    await this.admin.deleteFaculty(id);
    return { message: 'Faculty deleted' };
  }

  @Get('faculties/:facultyId/programs')
  @ApiOperation({ summary: 'List programs by faculty' })
  async getProgramsByFaculty(@Param('facultyId') facultyId: string) {
    return this.query.getProgramsByFaculty(facultyId);
  }

  @Get('programs/:id')
  @ApiOperation({ summary: 'Get program by ID' })
  async getProgramById(@Param('id') id: string) {
    return this.query.getProgramById(id);
  }

  @Post('programs')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new program' })
  async createProgram(@Body() dto: CreateProgramDto) {
    return this.admin.createProgram(dto);
  }

  @Delete('programs/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a program' })
  async deleteProgram(@Param('id') id: string) {
    await this.admin.deleteProgram(id);
    return { message: 'Program deleted' };
  }

  @Get('programs/:programId/cohorts')
  @ApiOperation({ summary: 'List cohorts by program' })
  async getCohortsByProgram(@Param('programId') programId: string) {
    return this.query.getCohortsByProgram(programId);
  }

  @Get('cohorts/:id')
  @ApiOperation({ summary: 'Get cohort by ID' })
  async getCohortById(@Param('id') id: string) {
    return this.query.getCohortById(id);
  }

  @Post('cohorts')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new cohort' })
  async createCohort(@Body() dto: CreateCohortDto) {
    return this.admin.createCohort({
      programId: dto.programId,
      name: dto.name,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Delete('cohorts/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a cohort' })
  async deleteCohort(@Param('id') id: string) {
    await this.admin.deleteCohort(id);
    return { message: 'Cohort deleted' };
  }
}
