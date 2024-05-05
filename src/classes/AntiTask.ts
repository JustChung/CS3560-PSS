import Task from "./Task";

export enum AntiTaskType {
  Cancellation = "Cancellation",
}

export class AntiTask extends Task<AntiTaskType> {
  constructor(name: string, taskType: AntiTaskType, startTime: number, startDate: number, duration: number) {
    super(name, taskType, startTime, startDate, duration);
    this.taskType = taskType;
  }

  verifyCancel(): boolean {
    return true;
  }
}
