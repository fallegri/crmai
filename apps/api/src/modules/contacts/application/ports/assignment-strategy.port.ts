export const ASSIGNMENT_STRATEGY_PORT = 'AssignmentStrategyPort';

export interface AssignmentStrategyPort {
  selectAdvisor(programId: string): Promise<string | null>;
}
