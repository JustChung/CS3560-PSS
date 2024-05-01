import Task from "./Task";

export enum AntiTaskType {
  Cancellation = "Cancellation",
}

class AntiTask extends Task<AntiTaskType> {
  constructor(name: string, startTime: number, startDate: number, duration: number, taskType: AntiTaskType) {
    super(name, "Anti", startTime, startDate, duration);
    this.taskType = taskType;
  }

  verifyCancel(): boolean {
    return true;
  }
}

export { AntiTask, AntiTaskType };
