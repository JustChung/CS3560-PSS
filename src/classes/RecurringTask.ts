import Task from "./Task";
import { getDigit, getDaysInMonth } from "../utils";

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

  override appendTo(taskArr: Task<string>[]): void {
    switch (this.frequency) {
      case Frequency.Daily:
        this.appendRecurringTasks(taskArr, 1);
        break;
      case Frequency.Weekly:
        this.appendRecurringTasks(taskArr, 7);
        break;
      case Frequency.Monthly:
        this.appendRecurringTasks(taskArr, 100);
        break;
    }
  }

  private appendRecurringTasks(taskArr: Task<string>[], frequency: number): void {
    for (let startDate = this.startDate; startDate <= this.endDate; startDate += frequency) {
      startDate = this.validateDate(startDate);
      const recurringTask = new RecurringTask(
        this.name,
        this.taskType as RecurringTaskType,
        this.startTime,
        startDate,
        this.duration,
        this.endDate!,
        this.frequency!
      );
      taskArr.push(recurringTask);
    }
  }

  // Increments month and year if necessary
  private validateDate(date: number): number {
    let newDate = date;
    const day = getDigit(date, 1) + getDigit(date, 2) * 10;
    const month = getDigit(date, 3) + getDigit(date, 4) * 10;
    const year = (date - (month * 100 + day)) / 10 ** 4;
    if (day > getDaysInMonth(month, year)) {
      newDate += 100;
      newDate -= day;
    }
    if (month > 12) {
      newDate += 10000;
      newDate -= month;
    }
    return newDate;
  }
}
