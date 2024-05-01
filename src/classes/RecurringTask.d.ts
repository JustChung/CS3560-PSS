import Task from "./Task";

export enum RecurringTaskType {
  Class = "Class",
  Study = "Study",
  Sleep = "Sleep",
  Exercise = "Exercise",
  Work = "Work",
  Meal = "Meal",
}

export enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

class RecurringTask extends Task<RecurringTaskType> {
  endDate: number;
  frequency: number;

  constructor(
    name: string,
    startTime: number,
    startDate: number,
    duration: number,
    endDate: number,
    frequency: Frequency,
    taskType: RecurringTaskType
  ) {
    super(name, "Recurring", startTime, startDate, duration);
    this.endDate = endDate;
    this.frequency = frequency;
    this.taskType = taskType;
  }
}

export { RecurringTask, RecurringTaskType };
