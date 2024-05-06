import Task from "./Task";
import { AntiTask } from "./AntiTask";
import { TransientTask } from "./TransientTask";
import { dayOfTheWeek, getDigit, getDayOfMonth, getDaysInMonth } from "../utils";

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

  appendTo(taskArr: Task<string>[]): void {
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
      if (!this.verifyNoOverlap(recurringTask, taskArr)) {
        throw new Error(`Unable to add recurring task ${this.name}: overlaps with existing task`);
      }
      taskArr.push(recurringTask);
    }
  }
  

  private verifyNoOverlap(recurringTask: RecurringTask, taskArr: Task<string>[]): boolean {
    for (const task of taskArr) {
      if (
        task instanceof AntiTask ||
        !(
          (task instanceof RecurringTask || task instanceof TransientTask) &&
          (
            (task instanceof TransientTask && task.startDate === recurringTask.startDate && task.startTime === recurringTask.startTime) ||
            (
              task instanceof RecurringTask &&
              (
                (recurringTask.frequency === Frequency.Daily) ||
                (
                  recurringTask.frequency === Frequency.Weekly &&
                  dayOfTheWeek(recurringTask.startDate) === dayOfTheWeek(task.startDate)
                ) ||
                (
                  recurringTask.frequency === Frequency.Monthly &&
                  getDayOfMonth(recurringTask.startDate) === getDayOfMonth(task.startDate)
                )
              )
            )
          ) &&
          (
            recurringTask.startTime < task.startTime + task.duration &&
            task.startTime < recurringTask.startTime + recurringTask.duration
          )
        )
      ) {
        return false;
      }
    }
    return true;
  }

  // Increments month and year if necessary
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