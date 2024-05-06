import Task from "./Task";
import { getDigit, getDaysInMonth } from "../utils";
import { AntiTask } from "./AntiTask";

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
      if (!this.verifyNoOverlap(taskArr, startDate, this.startTime, this.duration)) {
        throw new Error(`Overlap detected: Unable to add recurring task "${this.name}" due to scheduling conflict.`);
      }
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

  private verifyNoOverlap(taskArr: Task<string>[], startDate: number, startTime: number, duration: number): boolean {
    for (const task of taskArr) {
      if (
        task.startDate === startDate &&
        startTime < task.startTime + task.duration &&
        task.startTime < startTime + duration
      ) {
        if (task instanceof AntiTask) {
          continue;
        }
        if (
          task instanceof RecurringTask &&
          taskArr.some(
            (aTask) =>
              aTask instanceof AntiTask &&
              aTask.startDate === task.startDate &&
              aTask.startTime === task.startTime &&
              aTask.duration === task.duration
          )
        ) {
          continue;
        }
        return false;
      }
    }
    return true;
  }

  private validateDate(date: number): number {
    const day = getDigit(date, 1) + getDigit(date, 2) * 10;
    const month = getDigit(date, 3) + getDigit(date, 4) * 10;
    const year = Math.floor(date / 10000);

    const currentDate = new Date(year, month - 1, day);
    const daysInMonth = getDaysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear());

    if (currentDate.getDate() > daysInMonth) {
      currentDate.setDate(daysInMonth);
    }

    const adjustedDay = currentDate.getDate();
    const adjustedMonth = currentDate.getMonth() + 1;
    const adjustedYear = currentDate.getFullYear();

    return adjustedYear * 10000 + adjustedMonth * 100 + adjustedDay;
  }
}
