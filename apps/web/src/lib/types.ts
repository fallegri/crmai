export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacultyDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateFacultyDto {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export interface Program {
  id: string;
  facultyId: string;
  name: string;
  code: string;
  description?: string;
  durationMonths: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  faculty?: Faculty;
}

export interface CreateProgramDto {
  facultyId: string;
  name: string;
  code: string;
  description?: string;
  durationMonths: number;
}

export interface Cohort {
  id: string;
  programId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  program?: Program;
}

export interface CreateCohortDto {
  programId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  identityDocument?: string;
  identityType?: string;
  source?: string;
  notes?: string;
  isDuplicated: boolean;
  mergedIntoId?: string;
  createdAt: string;
  updatedAt: string;
  opportunities?: Opportunity[];
}

export interface PipelineStage {
  id: string;
  name: string;
  position: number;
  isTerminal: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
  opportunities?: Opportunity[];
}

export interface Opportunity {
  id: string;
  contactId: string;
  programId: string;
  cohortId?: string;
  currentStageId: string;
  assignedAdvisorId?: string;
  source?: string;
  status: 'ACTIVE' | 'WON' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  contact?: Contact;
  currentStage?: PipelineStage;
}

export interface CreateOpportunityDto {
  contactId: string;
  programId: string;
  cohortId?: string;
  source?: string;
  notes?: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  contactId?: string;
  opportunityId?: string;
  ownerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgendaEventDto {
  title: string;
  description?: string;
  eventType?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  contactId?: string;
  opportunityId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  startDate?: string;
  endDate?: string;
  config?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  config?: Record<string, any>;
}

export interface ActivityEvent {
  id: string;
  contactId?: string;
  opportunityId?: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  actorId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  channel: string;
  readAt?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  contactId?: string;
  opportunityId?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  identityDocument?: string;
  identityType?: string;
  source?: string;
  notes?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
