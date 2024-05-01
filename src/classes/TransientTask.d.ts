import Task from "./Task";

export enum TransientTaskType {
  Visit = "Visit",
  Shopping = "Shopping",
  Appointment = "Appointment",
}

class TransientTask extends Task<TransientTaskType> {
  constructor(name: string, startTime: number, startDate: number, duration: number, taskType: TransientTaskType) {
    super(name, "Transient", startTime, startDate, duration);
    this.taskType = taskType;
  }
}

export { TransientTask, TransientTaskType };
