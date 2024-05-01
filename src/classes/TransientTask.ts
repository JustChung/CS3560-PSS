import Task from "./Task";

export enum TransientTaskType {
  Visit = "Visit",
  Shopping = "Shopping",
  Appointment = "Appointment",
}

export class TransientTask extends Task<TransientTaskType> {
  constructor(name: string, taskType: TransientTaskType, startTime: number, startDate: number, duration: number) {
    super(name, taskType, startTime, startDate, duration);
  }
}
