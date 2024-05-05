import { calcEndTime, getDateTime, getDigit, getDaysInMonth } from "../utils";
import { AntiTask, AntiTaskType } from "./AntiTask";
import { Frequency, RecurringTask, RecurringTaskType } from "./RecurringTask";
import Task from "./Task";
import { TransientTask, TransientTaskType } from "./TransientTask";

export default class PSSModel {
  private emailAddress: string;
  private tasks: Task[];

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
    this.tasks = [];
  }

  printTasks(): void {
    console.log(this.tasks);
  }

  createTask(
    name: string,
    taskClass: "transient" | "anti" | "recurring",
    startTime: number,
    startDate: number,
    duration: number,
    taskType: TransientTaskType | AntiTaskType | RecurringTaskType,
    endDate?: number,
    frequency?: Frequency
  ): void {
    switch (taskClass) {
      case "anti": {
        const antiTask = new AntiTask(name, taskType as AntiTaskType, startTime, startDate, duration);
        antiTask.appendTo(this.tasks)
        break;
      }
      case "transient": {
        const transientTask = new TransientTask(name, taskType as TransientTaskType, startTime, startDate, duration);
        transientTask.appendTo(this.tasks)
        break;
      }
      case "recurring": {
        const recurringTask = new RecurringTask(name, taskType as RecurringTaskType, startTime, startDate, duration, endDate!, frequency!);
        recurringTask.appendTo(this.tasks)
        break;
      }
      default:
        throw new Error("Impossible to reach line, possible unhandled case");
    }
  }

  getTask(name: string): Task | undefined {
    return this.tasks.find((task) => task.name === name);
  }

  deleteTask(name: string): void {
    // TODO (luciano): I don't think this was implemented properly, .filter doesn't modify the existing array
    this.tasks = this.tasks.filter((task) => task.name !== name);
    // TODO (luciano): when deleting recurring task, delete all corresponding anti-tasks as well
  }

  verifyUniqueName(name: string): boolean {
    return !this.tasks.some((task) => task.name === name);
  }

  // TODO (luciano): verify it's ok that we're also passing in task class (differs from class diagram)
  verifyNoOverlap(
    taskClass: "transient" | "anti" | "recurring",
    startDate: number,
    startTime: number,
    duration: number,
  ): true | string {
    // Check for overlapping transient tasks
    for (const task of this.tasks) {
      if (
        task.startDate === startDate &&
        startTime < calcEndTime(task.startTime, task.duration) &&
        task.startTime < calcEndTime(startTime, duration)
      ) {
        return `New ${taskClass} task conflicts with existing ${task.taskType} "${task.name}" on ${getDateTime(
          task.startDate,
          task.startTime
        )}.`;
      }
    }
    this.printTasks()
    return true;
  }

  verifyValidDate(date: number): true | string {
    if (date >= 100000000) {
      return "Invalid date length. Date format must be YYYYMMDD."
    }
    const day = getDigit(date, 1)+getDigit(date, 2)*10
    const month = getDigit(date, 3)+getDigit(date, 4)*10
    const year = (date - (month*100+day)) / 10**4
    if (day > getDaysInMonth(month, year)) {
      return "Invalid day: given day exceeds the number of days in given month"
    }
    if (month > 12) {
      return "Invalid month: given month exceeds 12"
    }
    return true
  }

  writeScheduleToFile(fileName: string): void {
    // NEED TO IMPLEMENT
    fileName;
  }

  getSchedule(startDate: number, type: "day" | "week" | "month"): Task[] {
    let endDate: number;
    switch (type) {
      case "day":
        endDate = startDate + 1;
        break;
      case "week":
        endDate = startDate + 7;
        break;
      case "month":
        endDate = startDate + 31;
        break;
      default:
        throw new Error("Invalid type specified");
    }

    return this.tasks.filter((task) => {
      // TODO (luciano) this doesn't work with recurring tasks
      return task.startDate >= startDate && task.startDate < endDate;
    });
  }

  writePartialScheduleToFile(fileName: string, startDate: number, type: "day" | "week" | "month"): void {
    // NEED TO IMPLEMENT
    fileName;
    startDate;
    type;
  }

  readScheduleFromFile(fileName: string): void {
    // NEED TO IMPLEMENT
    fileName;
  }
}
