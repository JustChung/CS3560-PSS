import { dayOfTheWeek } from "../utils";
import { AntiTask, AntiTaskType } from "./AntiTask";
import { Frequency, RecurringTask, RecurringTaskType } from "./RecurringTask";
import Task from "./Task";
import { TransientTask, TransientTaskType } from "./TransientTask";

export default class PSSModel {
  emailAddress: string;
  tasks: Task[];

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
    this.tasks = [];
  }

  createTask(
    name: string,
    taskClass: "transient" | "anti" | "recurring",
    startTime: number,
    startDate: number,
    duration: number,
    taskType: TransientTaskType | AntiTaskType | RecurringTaskType,
    endDate?: number,
    frequency?: number
  ): void {
    switch (type) {
      case "anti":
        this.tasks.push(new AntiTask(name, type, startTime, startDate, duration));
        break;
      case "transient":
        this.tasks.push(new TransientTask(name, type, startTime, startDate, duration));
        break;
      case "recurring":
        this.tasks.push(new RecurringTask(name, type, startDate, duration, endDate, frequency));
    }
    const task = new Task(name, type, startTime, startDate, duration);
    this.tasks.push(task);
  }

  getTask(name: string): Task | undefined {
    return this.tasks.find((task) => task.name === name);
  }

  deleteTask(name: string): void {
    this.tasks = this.tasks.filter((task) => task.name !== name);
    // TODO (luciano): when deleting recurring task, delete all corresponding anti-tasks as well
  }

  verifyUniqueName(name: string): boolean {
    return !this.tasks.some((task) => task.name === name);
  }

  // TODO (luciano): verify it's ok that we're also passing in task type (differs from class diagram)
  verifyNoOverlap(
    taskClass: "transient" | "anti" | "recurring",
    startDate: number,
    startTime: number,
    duration: number
  ): boolean {
    switch (taskClass) {
      case "transient":
        // TODO: implement transient task overlap check
        break;
      case "anti":
        // Check for existing antitask (we don't need to check duration)
        if (
          this.tasks.some(
            (task) => task instanceof AntiTask && task.startDate === startDate && task.startTime === startTime
          )
        ) {
          return false;
        }

        // Check for valid recurring task
        for (const recurringTask of this.tasks.filter((task): task is RecurringTask => task instanceof RecurringTask)) {
          // Check for same day
          if (
            (Frequency.Daily && recurringTask.startDate % 100 === startDate % 100) ||
            (Frequency.Weekly && dayOfTheWeek(recurringTask.startDate) === dayOfTheWeek(recurringTask.endDate)) ||
            (Frequency.Monthly && getMonth(recurringTask.startDate) === getMonth(startDate))
          ) {
            // Check for same time
            if (startTime === recurringTask.startTime && duration === recurringTask.duration) {
              return true;
            }
          }
        }
        return false;
      case "recurring":
        //  TODO: implement recurring task overlap check
        break;
    }
    throw new Error("Impossible to reach line, possible unhandled case");
  }

  writeScheduleToFile(fileName: string): void {
    // NEED TO IMPLEMENT
    fileName;
  }

  getSchedule(startDate: number, type: "day" | "week" | "month"): Task[] {
    let endDate: number;
    switch (type) {
      case Frequency.Daily:
        endDate = startDate + 1;
        break;
      case Frequency.Weekly:
        endDate = startDate + 7;
        break;
      case Frequency.Monthly:
        endDate = startDate + 31;
        break;
      default:
        throw new Error("Invalid type specified");
    }

    return this.tasks.filter((task) => {
      return task.startDate >= startDate && task.startDate < endDate;
    });
  }

  writePartialScheduleToFile(fileName: string, startDate: number, type: "day" | "week" | "month"): void {
    // NEED TO IMPLEMENT
    fileName, startDate, type;
  }

  readScheduleFromFile(fileName: string): void {
    // NEED TO IMPLEMENT
    fileName;
  }
}
