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

export class RecurringTask extends Task<RecurringTaskType> {
  endDate: number;
  frequency: Frequency;

  constructor(
    name: string,
    taskType: RecurringTaskType,
    startTime: number,
    startDate: number,
    duration: number,
    endDate: number,
    frequency: Frequency
  ) {
    super(name, taskType, startTime, startDate, duration);
    this.endDate = endDate;
    this.frequency = frequency;
  }
}
