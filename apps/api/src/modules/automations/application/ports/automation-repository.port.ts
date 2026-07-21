import { AutomationRule } from '../../domain';
export const AUTOMATION_REPOSITORY_PORT = 'AutomationRepositoryPort';
export interface AutomationRepositoryPort {
  create(data: { name: string; description?: string; triggerType: string; triggerConfig?: any; actionType: string; actionConfig?: any; priority?: number }): Promise<AutomationRule>;
  findAllActive(): Promise<AutomationRule[]>;
  findById(id: string): Promise<AutomationRule | null>;
  update(id: string, data: Partial<AutomationRule>): Promise<AutomationRule>;
  delete(id: string): Promise<void>;
}
