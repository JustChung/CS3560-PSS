import Task from "./Task"; // Import Task abstract class

// Enum defining the types of transient tasks
export enum TransientTaskType {
  Visit = "Visit",
  Shopping = "Shopping",
  Appointment = "Appointment",
}

// Class representing transient task, extending the Task class
export class TransientTask extends Task<TransientTaskType> {
  constructor(name: string, taskType: TransientTaskType, startTime: number, startDate: number, duration: number) {
    super(name, taskType, startTime, startDate, duration); // Calling superclass constructor
  }
}
