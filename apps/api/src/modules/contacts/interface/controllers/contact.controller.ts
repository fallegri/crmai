import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContactUseCase } from '../../application/use-cases';
import { JwtAuthGuard, RequirePermission } from '../../../identity/interface';
import { CreateContactDto } from '../dto';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactUseCase: ContactUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact with deduplication' })
  async create(@Body() dto: CreateContactDto) {
    return this.contactUseCase.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Search contacts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('search') search?: string) {
    return this.contactUseCase.findAll(+page, +limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  async findById(@Param('id') id: string) {
    return this.contactUseCase.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact' })
  async update(@Param('id') id: string, @Body() dto: CreateContactDto) {
    return this.contactUseCase.update(id, dto as any);
  }

  @Get(':id/duplicates')
  @ApiOperation({ summary: 'Get potential duplicates for a contact' })
  async findDuplicates(@Param('id') id: string) {
    return this.contactUseCase.findPotentialDuplicates(id);
  }

  @Post(':primaryId/merge/:secondaryId')
  @ApiOperation({ summary: 'Merge two contacts' })
  async mergeContacts(@Param('primaryId') primaryId: string, @Param('secondaryId') secondaryId: string) {
    return this.contactUseCase.mergeContacts(primaryId, secondaryId);
  }
}
