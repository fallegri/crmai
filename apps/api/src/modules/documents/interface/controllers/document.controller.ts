import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentUseCase } from '../../application/use-cases';
import { JwtAuthGuard, CurrentUser } from '../../../identity/interface';
import { UploadDocumentDto } from '../dto';
@ApiTags('Documents') @Controller('documents') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
export class DocumentController {
  constructor(private readonly documentUseCase: DocumentUseCase) {}
  @Post() @ApiOperation({ summary: 'Upload a document' }) async upload(@Body() dto: UploadDocumentDto, @CurrentUser('sub') userId: string) { return this.documentUseCase.upload({ ...dto, uploadedBy: userId }); }
  @Get(':id') @ApiOperation({ summary: 'Get document by ID' }) async findById(@Param('id') id: string) { return this.documentUseCase.findById(id); }
  @Get('contact/:contactId') @ApiOperation({ summary: 'Get documents by contact' }) async getByContact(@Param('contactId') contactId: string) { return this.documentUseCase.getContactDocuments(contactId); }
  @Get('opportunity/:opportunityId') @ApiOperation({ summary: 'Get documents by opportunity' }) async getByOpportunity(@Param('opportunityId') opportunityId: string) { return this.documentUseCase.getOpportunityDocuments(opportunityId); }
  @Delete(':id') @ApiOperation({ summary: 'Delete document' }) async delete(@Param('id') id: string) { await this.documentUseCase.delete(id); return { message: 'Document deleted' }; }
}
