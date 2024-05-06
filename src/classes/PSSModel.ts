import { getDateTime, dayOfTheWeek, getDigit, getDayOfMonth, getDaysInMonth, numberToFrequency } from "../utils";
import { AntiTask, AntiTaskType } from "./AntiTask";
import PSSController from "./PSSController";
import { Frequency, RecurringTask, RecurringTaskType } from "./RecurringTask";
import Task from "./Task";
import { TransientTask, TransientTaskType } from "./TransientTask";
import { saveAs } from "file-saver";

export default class PSSModel {
  private controller: PSSController | null;
  private emailAddress: string;
  private tasks: Task[];

  constructor(emailAddress: string) {
    this.controller = null;
    this.emailAddress = emailAddress;
    this.tasks = [];
  }

  setController(controller: PSSController) {
    this.controller = controller;
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
        antiTask.appendTo(this.tasks);
        break;
      }
      case "transient": {
        const transientTask = new TransientTask(name, taskType as TransientTaskType, startTime, startDate, duration);
        transientTask.appendTo(this.tasks);
        break;
      }
      case "recurring": {
        const recurringTask = new RecurringTask(
          name,
          taskType as RecurringTaskType,
          startTime,
          startDate,
          duration,
          endDate!,
          frequency!
        );
        recurringTask.appendTo(this.tasks);
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
    endDate?: number,
    frequency?: Frequency
  ): true | string {
    // Check for overlapping transient tasks
    switch (taskClass) {
      case "transient":
        for (const task of this.tasks) {
          // Ignore Anti-tasks
          if (task instanceof AntiTask) {
            continue;
          }
          // Check if another transient/recurring task is conflicting
          if (
            task.startDate === startDate &&
            startTime < task.startTime + task.duration &&
            task.startTime < startTime + duration
          ) {
            // Check if recurring task is cancelled by anti-task
            if (
              task instanceof RecurringTask &&
              this.tasks.some(
                (aTask) =>
                  aTask.startDate === task.startDate &&
                  aTask.startTime === task.startTime &&
                  aTask.duration === task.duration
              )
            ) {
              continue;
            }
            return `New ${taskClass} task conflicts with existing ${task.taskType} "${task.name}" on ${getDateTime(
              task.startDate,
              task.startTime
            )}.`;
          }
        }
        return true;
      case "recurring":
        for (const task of this.tasks) {
          if (
            Frequency.Daily ||
            (frequency === Frequency.Weekly && dayOfTheWeek(startDate) === dayOfTheWeek(endDate ?? -1)) ||
            (frequency === Frequency.Monthly && getDayOfMonth(task.startDate) === getDayOfMonth(startDate))
          ) {
            // Check for overlapping time
            if (startTime < task.startTime + task.duration && task.startDate < startTime + duration) {
              return `New recurring tasks conflicts with existing ${task.taskType} task "${task.name}" at ${getDateTime(
                task.startDate,
                task.startTime
              )}`;
            }
          }
        }
        return true;
      case "anti":
        // Check for existing antitask (we don't need to check duration)
        for (const antiTask of this.tasks.filter((task): task is AntiTask => task instanceof AntiTask)) {
          if (startDate === antiTask.startDate && startTime === antiTask.startTime && duration === antiTask.duration) {
            return `New antitask conflicts with an existing anti-task ${antiTask.name}.`;
          }
        }

        // Check for valid recurring task
        for (const recurringTask of this.tasks.filter((task): task is RecurringTask => task instanceof RecurringTask)) {
          // Check if anti-task is within date range and correct time
          if (
            startDate === recurringTask.startDate &&
            startTime === recurringTask.startTime &&
            duration === recurringTask.duration
          ) {
            return true;
          }
        }
        return `Unable to find recurring task that starts at ${getDateTime(
          startDate,
          startTime
        )} and lasts for ${duration} minutes`;
    }
  }

  verifyValidDate(date: number): true | string {
    if (date >= 100000000) {
      return "Invalid date length. Date format must be YYYYMMDD.";
    }
    const day = getDigit(date, 1) + getDigit(date, 2) * 10;
    const month = getDigit(date, 3) + getDigit(date, 4) * 10;
    const year = (date - (month * 100 + day)) / 10 ** 4;
    if (day > getDaysInMonth(month, year)) {
      return "Invalid day: given day exceeds the number of days in given month";
    }
    if (month > 12) {
      return "Invalid month: given month exceeds 12";
    }
    return true;
  }

  writeScheduleToFile(fileName: string): void {
    try {
      const scheduleData = JSON.stringify(this.tasks);
      const blob = new Blob([scheduleData], { type: "application/json" });
      saveAs(blob, fileName);
      console.log(`Schedule saved to file '${fileName}' successfully.`);
    } catch(error) {
      console.error(`Error saving schedule to file '${fileName}':`, error);
    }
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

  readScheduleFromFile(file: File): void {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target) {
        // makes use of addTask() to validate tasks, use added_task arrys to track added task for when there is an error,
        // and added task must be deleted from schedule
        const added_task: string[] = [];
        try {
          const fileData = JSON.parse(event.target.result as string);
          fileData.forEach(
            (taskData: {
              Name: string;
              Type: TransientTaskType | RecurringTaskType | AntiTaskType;
              StartDate: number;
              StartTime: number;
              Duration: number;
              EndDate?: number;
              Frequency?: number;
              Date: number;
            }) => {
              const { Name, Type, StartDate, StartTime, Duration, EndDate, Frequency, Date } = taskData;
              let result: true | string | undefined;
              switch (Type) {
                case "Class":
                case "Study":
                case "Sleep":
                case "Exercise":
                case "Work":
                case "Meal":
                  result = this.controller?.addTask(
                    Name,
                    "recurring",
                    StartTime,
                    StartDate,
                    Duration,
                    Type,
                    EndDate,
                    Frequency ? numberToFrequency(Frequency) : undefined
                  );
                  if (result !== true) {
                    throw new Error(result);
                  }
                  added_task.push(Name);
                  break;
                case "Cancellation":
                  result = this.controller?.addTask(Name, "anti", StartTime, Date, Duration, Type);
                  if (result !== true) {
                    throw new Error(result);
                  }
                  added_task.push(Name);
                  break;
                case "Visit":
                case "Shopping":
                case "Appointment":
                  result = this.controller?.addTask(Name, "transient", StartTime, Date, Duration, Type);
                  if (result !== true) {
                    throw new Error(result);
                  }
                  added_task.push(Name);
                  break;
                default:
                  console.log(`Could not create task ${Name}`);
                  break;
              }
            }
          );

          console.log(`Schedule from file '${file.name}' loaded successfully.`);
        } catch (error) {
          added_task.forEach((taskName) => {
            this.deleteTask(taskName);
          });
          console.error(`Error in '${file.name}':`, error);
        }
      }
    };

    fileReader.readAsText(file);
  }
}
