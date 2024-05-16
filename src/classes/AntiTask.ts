import Task from "./Task"; // Import Task class

// Enum defining types of AntiTasks
export enum AntiTaskType {
  Cancellation = "Cancellation",
}

// Class represneting AntiTask
export class AntiTask extends Task<AntiTaskType> {
  constructor(name: string, taskType: AntiTaskType, startTime: number, startDate: number, duration: number) {
    super(name, taskType, startTime, startDate, duration); // Calling superclass constructor
    this.taskType = taskType; // Setting taskType property
  }

  verifyCancel(): boolean {
    return true;
  }
}
