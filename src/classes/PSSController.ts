import PSSModel from "./PSSModel";
import Task from "./Task";
import { TransientTaskType } from "./TransientTask";
import { AntiTaskType } from "./AntiTask";
import { Frequency, RecurringTaskType } from "./RecurringTask";

export default class PSSController {
  pss: PSSModel;

  constructor(pss: PSSModel) {
    this.pss = pss;
  }

  addTask(
    name: string,
    taskClass: "transient" | "anti" | "recurring",
    startTime: number,
    startDate: number,
    duration: number,
    taskType: TransientTaskType | AntiTaskType | RecurringTaskType,
    endDate?: number,
    frequency?: Frequency
  ): true | string {
    if (!this.pss.verifyUniqueName(name)) {
      return `A task with the name "${name}" already exists.`;
    }
    const validDate = this.pss.verifyValidDate(startDate);
    if (validDate !== true) {
      return validDate;
    }
    const noOverlap = this.pss.verifyNoOverlap(taskClass, startDate, startTime, duration);
    if (noOverlap === true) {
      this.pss.createTask(name, taskClass, startTime, startDate, duration, taskType, endDate, frequency);
    } else {
      return noOverlap;
    }

    return true;
  }

  printTasks(): void {
    this.pss.printTasks();
  }
  
  deleteTask(name: string): string | void {
    return this.pss.deleteTask(name);
  }

  viewTask(name: string): Task | undefined {
    return this.pss.getTask(name);
  }

  viewSchedule(startDate: number, type: "day" | "week" | "month" | "calendar"): Task[] {
    return this.pss.getSchedule(startDate, type);
  }

  writeScheduleToFile(fileName: string, startDate: number, type: "whole" | "day" | "week" | "month"): void {
    this.pss.writeScheduleToFile(fileName, startDate, type);
  }

  inputFileToSchedule(fileName: File): void {
    this.pss.readScheduleFromFile(fileName);
  }
}
