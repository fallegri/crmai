import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AgendaUseCase } from '../../application/use-cases';
import { JwtAuthGuard, CurrentUser } from '../../../identity/interface';
import { CreateEventDto } from '../dto';

@ApiTags('Agenda')
@Controller('agenda')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AgendaController {
  constructor(private readonly agendaUseCase: AgendaUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser('sub') ownerId: string,
  ) {
    return this.agendaUseCase.create({
      ...dto,
      ownerId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get calendar events' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getCalendar(
    @CurrentUser('sub') ownerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.agendaUseCase.getCalendar(
      ownerId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  async findById(@Param('id') id: string) {
    return this.agendaUseCase.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an event' })
  async update(@Param('id') id: string, @Body() dto: CreateEventDto) {
    return this.agendaUseCase.update(id, {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  async delete(@Param('id') id: string) {
    await this.agendaUseCase.delete(id);
    return { message: 'Event deleted' };
  }
}
