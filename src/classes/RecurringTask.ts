import Task from "./Task";
import { AntiTask } from "./AntiTask";
import { getDigit, getDaysInMonth } from "../utils";

// Enum defining types of recurring tasks
export enum RecurringTaskType {
  Class = "Class",
  Study = "Study",
  Sleep = "Sleep",
  Exercise = "Exercise",
  Work = "Work",
  Meal = "Meal",
}

// Enum defining the frequency of recurring tasks
export enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

// Class representing recurring task
export class RecurringTask extends Task<RecurringTaskType> {
  endDate: number; // End date of recurring task
  frequency: Frequency; // Frequency of recurring task

  constructor(
    name: string,
    taskType: RecurringTaskType,
    startTime: number,
    startDate: number,
    duration: number,
    endDate: number,
    frequency: Frequency
  ) {
    super(name, taskType, startTime, startDate, duration); // Calling superclass constructor
    this.endDate = endDate; // Setting the end date
    this.frequency = frequency; // Setting the frequency
  }

  // Method to append recurring tasks to provided task array
  override appendTo(taskArr: Task<string>[]): void {
    const recurringTasks: RecurringTask[] = [];
    
    // Generate recurring tasks based on frequency
    switch (this.frequency) {
      case Frequency.Daily:
        this.generateRecurringTasks(recurringTasks, 1);
        break;
      case Frequency.Weekly:
        this.generateRecurringTasks(recurringTasks, 7);
        break;
      case Frequency.Monthly:
        this.generateRecurringTasks(recurringTasks, 100);
        break;
    }

    // CHeck for conflicts before adding recurring tasks
    if (this.checkNoConflicts(taskArr, recurringTasks)) {
      taskArr.push(...recurringTasks); // Add recurring tasks to the task array
    } else {
      throw new Error(`Overlap detected: Unable to add recurring tasks due to scheduling conflict.`);
    }
  }

  // Method to generate recurring tasks based on the given frequency
  private generateRecurringTasks(taskArr: RecurringTask[], frequency: number): void {
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

  // Method to check for conflicts with existing tasks
  private checkNoConflicts(taskArr: Task<string>[], recurringTasks: RecurringTask[]): boolean {
    for (const recurringTask of recurringTasks) {
      for (const task of taskArr) {
        if (
          task.startDate === recurringTask.startDate &&
          recurringTask.startTime < task.startTime + task.duration &&
          task.startTime < recurringTask.startTime + recurringTask.duration
        ) {
          if (task instanceof AntiTask) {
            continue; // Ignore antitasks
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
            continue; // Ignore recurring tasks cancelled by antitasks
          }
          return false;
        }
      }
    }
    return true;
  }

  // Method to validate date and change if necessary
  private validateDate(date: number): number {
    // Extract day, month, year from date
    const day = getDigit(date, 1) + getDigit(date, 2) * 10;
    const month = getDigit(date, 3) + getDigit(date, 4) * 10;
    const year = Math.floor(date / 10000);

    // Create a date object
    const currentDate = new Date(year, month - 1, day);
    // Get days in the month
    const daysInMonth = getDaysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear());

    // Adjust the date if it exceeds the number of days in the month
    if (currentDate.getDate() > daysInMonth) {
      currentDate.setDate(daysInMonth);
    }

    // Get the adjusted day, month, and year
    const adjustedDay = currentDate.getDate();
    const adjustedMonth = currentDate.getMonth() + 1;
    const adjustedYear = currentDate.getFullYear();

    // Return the adjusted date
    return adjustedYear * 10000 + adjustedMonth * 100 + adjustedDay;
  }
}
