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

  // Method to add task to schedule
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
    // Check if task name is unique
    if (!this.pss.verifyUniqueName(name)) {
      return `A task with the name "${name}" already exists.`;
    }

    // Verify that the start date is valid
    const validDate = this.pss.verifyValidDate(startDate);
    if (validDate !== true) {
      return validDate;
    }

    // Check for overlapping tasks
    const noOverlap = this.pss.verifyNoOverlap(taskClass, startDate, startTime, duration);
    if (noOverlap === true) {
      // Create task if there are no overlaps
      this.pss.createTask(name, taskClass, startTime, startDate, duration, taskType, endDate, frequency);
    } else {
      // Return error if there are overlaps
      return noOverlap;
    }

    return true; // Return true if task added successfully
  }

  // Method to print all tasks in the schedule
  printTasks(): void {
    this.pss.printTasks();
  }

  // Method to delete a task from the schedule by name
  deleteTask(name: string): string | void {
    return this.pss.deleteTask(name);
  }

  // Method to view details of a task by name
  viewTask(name: string): Task | undefined {
    return this.pss.getTask(name);
  }

  // Method to view schedule for the specified date range
  viewSchedule(startDate: number, type: "day" | "week" | "month" | "calendar"): Task[] {
    return this.pss.getSchedule(startDate, type);
  }

  // Method to wrte schedule to file
  writeScheduleToFile(fileName: string, startDate: number, type: "whole" | "day" | "week" | "month"): void {
    this.pss.writeScheduleToFile(fileName, startDate, type);
  }

  // Method to read schedule data from file and update schedule
  inputFileToSchedule(fileName: File): void {
    this.pss.readScheduleFromFile(fileName);
  }
}
