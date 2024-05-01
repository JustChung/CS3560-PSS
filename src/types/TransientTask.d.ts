import Task from "./Task";

enum TaskType {
  Visit = "Visit",
  Shopping = "Shopping",
  Appointment = "Appointment",
}

class TransientTask extends Task {
  taskType: TaskType;

  constructor(name: string, startTime: number, startDate: number, duration: number, taskType: TaskType) {
    super(name, "Transient", startTime, startDate, duration);
    this.taskType = taskType;
  }
}

export { TransientTask, TaskType };
