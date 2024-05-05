import { calcEndTime, dayOfTheWeek, getDateTime, getDayOfMonth } from "../utils";
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
      case "anti":
        this.tasks.push(new AntiTask(name, taskType as AntiTaskType, startTime, startDate, duration));
        break;
      case "transient":
        this.tasks.push(new TransientTask(name, taskType as TransientTaskType, startTime, startDate, duration));
        break;
      case "recurring":
        this.tasks.push(
          new RecurringTask(name, taskType as RecurringTaskType, startTime, startDate, duration, endDate!, frequency!)
        );
        break;
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
    switch (taskClass) {
      case "transient":
        // Check for overlapping transient tasks
        for (const transientTask of this.tasks.filter((task): task is TransientTask => task instanceof TransientTask)) {
          if (
            transientTask.startDate === startDate &&
            startTime < calcEndTime(transientTask.startTime, transientTask.duration) &&
            transientTask.startTime < calcEndTime(startTime, duration)
          ) {
            return `New transient task conflicts with existing transient task "${transientTask.name}" on ${getDateTime(
              transientTask.startDate,
              transientTask.startTime
            )}.`;
          }
        }

        // Check for conflicting recurring tasks
        for (const recurringTask of this.tasks.filter((task): task is RecurringTask => task instanceof RecurringTask)) {
          // Check for same day
          if (
            recurringTask.frequency === Frequency.Daily ||
            (recurringTask.frequency === Frequency.Weekly &&
              dayOfTheWeek(recurringTask.startDate) === dayOfTheWeek(recurringTask.endDate)) ||
            (recurringTask.frequency === Frequency.Monthly &&
              getDayOfMonth(recurringTask.startDate) === getDayOfMonth(startDate))
          ) {
            // Check if recurring is within date range and overlapping time
            if (
              startDate >= recurringTask.startDate &&
              startDate <= recurringTask.endDate &&
              startTime < calcEndTime(recurringTask.startTime, recurringTask.duration) &&
              recurringTask.startTime < calcEndTime(startTime, duration)
            ) {
              // Check if there is an anti-task cancelling this recurring task out
              if (
                !this.tasks.some(
                  (task) =>
                    task instanceof AntiTask &&
                    task.startDate === startDate &&
                    task.startTime === recurringTask.startTime
                )
              )
                return `New transient task conflicts with an existing recurring task "${
                  recurringTask.name
                }" on ${getDateTime(startDate, recurringTask.startTime)}`;
            }
          }
        }
        return true;
      case "anti":
        // Check for existing antitask (we don't need to check duration)
        for (const antiTask of this.tasks.filter((task): task is AntiTask => task instanceof AntiTask)) {
          return `New antitask conflicts with an existing anti-task ${antiTask.name}.`;
        }

        // Check for valid recurring task
        for (const recurringTask of this.tasks.filter((task): task is RecurringTask => task instanceof RecurringTask)) {
          // Check for same day
          if (
            recurringTask.frequency === Frequency.Daily ||
            (recurringTask.frequency === Frequency.Weekly &&
              dayOfTheWeek(recurringTask.startDate) === dayOfTheWeek(recurringTask.endDate)) ||
            (recurringTask.frequency === Frequency.Monthly &&
              getDayOfMonth(recurringTask.startDate) === getDayOfMonth(startDate))
          ) {
            // Check if anti-task is within date range and correct time
            if (
              startDate >= recurringTask.startDate &&
              startDate <= recurringTask.endDate &&
              startTime === recurringTask.startTime &&
              duration === recurringTask.duration
            ) {
              return true;
            }
          }
        }
        return `Unable to find recurring task that starts at ${getDateTime(
          startDate,
          startTime
        )} and lasts for ${duration} minutes`;
      case "recurring":
        // Check for conflicting transient task
        for (const transientTask of this.tasks.filter((task): task is TransientTask => task instanceof TransientTask)) {
          // Check for same day
          if (
            Frequency.Daily ||
            (frequency === Frequency.Weekly && dayOfTheWeek(startDate) === dayOfTheWeek(endDate ?? -1)) ||
            (frequency === Frequency.Monthly && getDayOfMonth(transientTask.startDate) === getDayOfMonth(startDate))
          ) {
            // Check for overlapping time
            if (
              startTime < calcEndTime(transientTask.startDate, transientTask.duration) &&
              transientTask.startDate < calcEndTime(startDate, duration)
            ) {
              return `New recurring tasks conflicts with existing transient task "${
                transientTask.name
              }" at ${getDateTime(transientTask.startDate, transientTask.startTime)}`;
            }
          }
        }

        // TODO (luciano): Do we care if recurring tasks overlap with other recurring tasks?
        return true;
    }
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

  readScheduleFromFile(file: File): void {
    const fileReader = new FileReader();
  
    fileReader.onload = (event) => {
      if (event.target) {
        try {
          const fileData = JSON.parse(event.target.result as string);
          fileData.forEach((taskData: {
            Name: string;
            Type: TransientTaskType | RecurringTaskType | AntiTaskType;
            StartDate: number;
            StartTime: number;
            Duration: number;
            EndDate?: number;
            Frequency?: Frequency;
            Date: number;
          }) => {
            console.log(taskData)
            const {
              Name, 
              Type, 
              StartDate,
              StartTime,
              Duration,
              EndDate,
              Frequency,
              Date
            } = taskData;
            switch(Type) {
              case "Class":
              case "Study":
              case "Sleep":
              case "Exercise":
              case "Work":
              case "Meal":
                this.createTask(
                  Name,
                  "recurring",
                  StartTime,
                  StartDate,
                  Duration,
                  Type,
                  EndDate,
                  Frequency
                );
                break;
              case "Cancellation":
                this.createTask(
                  Name,
                  "anti",
                  StartTime,
                  Date,
                  Duration,
                  Type
                );
                break;
              case "Visit":
              case "Shopping":
              case "Appointment":
                this.createTask(
                  Name,
                  "transient",
                  StartTime,
                  Date,
                  Duration,
                  Type
                );
                break;
              default:
                console.log(`Could not create task ${Name}`);
                break;
            }
          });
  
          console.log(`Schedule from file '${file.name}' loaded successfully.`);
        } catch (error) {
          console.error(`Error in '${file.name}':`, error);
        }
      }
    };
  
    fileReader.readAsText(file);
  }
}
