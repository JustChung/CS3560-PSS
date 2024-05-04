import { AntiTaskType } from "./AntiTask";
import PSSModel from "./PSSModel";
import { Frequency, RecurringTaskType } from "./RecurringTask";
import Task from "./Task";
import { TransientTaskType } from "./TransientTask";

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
  ): void {
    if (this.pss.verifyNoOverlap(taskClass, startDate, startTime, duration)) {
      this.pss.createTask(name, taskClass, startTime, startDate, duration, taskType, endDate, frequency);
    }
    console.log(this.pss.tasks);
  }

  deleteTask(name: string): void {
    this.pss.deleteTask(name);
  }

  viewTask(name: string): Task | undefined {
    return this.pss.getTask(name);
  }

  viewSchedule(startDate: number, type: "day" | "week" | "month"): Task[] {
    return this.pss.getSchedule(startDate, type);
  }

  outputScheduleToFile(fileName: string): void {
    this.pss.writeScheduleToFile(fileName);
  }

  writePartialScheduleToFile(fileName: string, startDate: number, type: "day" | "week" | "month"): void {
    this.pss.writePartialScheduleToFile(fileName, startDate, type);
  }

  inputFileToSchedule(fileName: string): void {
    this.pss.readScheduleFromFile(fileName);
  }
}
