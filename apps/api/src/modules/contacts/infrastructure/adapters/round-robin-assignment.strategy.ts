import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AssignmentStrategyPort } from '../../application/ports';

@Injectable()
export class RoundRobinAssignmentStrategy implements AssignmentStrategyPort {
  constructor(private readonly prisma: PrismaService) {}

  async selectAdvisor(programId: string): Promise<string | null> {
    const assignments = await this.prisma.advisorAssignment.findMany({
      where: { programId, isActive: true },
      orderBy: { lastAssignedAt: 'asc' },
      take: 1,
    });
    if (assignments.length === 0) return null;
    const selected = assignments[0];
    await this.prisma.advisorAssignment.update({
      where: { id: selected.id },
      data: { lastAssignedAt: new Date() },
    });
    return selected.advisorId;
  }
}
