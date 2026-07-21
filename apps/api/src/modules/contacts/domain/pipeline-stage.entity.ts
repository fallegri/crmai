export class PipelineStage {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly position: number,
    public readonly isTerminal: boolean,
    public readonly color: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static TERMINAL_STAGES = ['Enrolled', 'Not Interested', 'Lost'];
}
