import PSSController from "./PSSController";
import Task from "./Task";
import { TransientTask, TransientTaskType } from "./TransientTask";
import { AntiTask, AntiTaskType } from "./AntiTask";
import { Frequency, RecurringTask, RecurringTaskType } from "./RecurringTask";
import { getDateTime, dayOfTheWeek, getDigit, getDayOfMonth, getDaysInMonth, numberToFrequency } from "../utils";
import { saveAs } from "file-saver";
import { AntiObject, TransientObject, decodeJSON } from "../jsonCodec";

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

  // Create new task based on provided parameters
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
    // Switch case to handle different types of tasks
    switch (taskClass) {
      // If task is antitask
      case "anti": {
        // Create new AntiTask instance
        const antiTask = new AntiTask(name, taskType as AntiTaskType, startTime, startDate, duration);
        // Append the task to the tasks array
        antiTask.appendTo(this.tasks);
        break;
      }
      // If the task is transient
      case "transient": {
        // Create new TransientTask instance
        const transientTask = new TransientTask(name, taskType as TransientTaskType, startTime, startDate, duration);
        // Append the task to the tasks array
        transientTask.appendTo(this.tasks);
        break;
      }
      // If task is reccuring
      case "recurring": {
        // Create a new RecurringTask instance
        const recurringTask = new RecurringTask(
          name,
          taskType as RecurringTaskType,
          startTime,
          startDate,
          duration,
          endDate!,
          frequency!
        );
        console.log("apeending", recurringTask);
        // Append the task to the tasks array
        recurringTask.appendTo(this.tasks);
        break;
      }
      default:
        // Throw an error if an impossible case is reached
        throw new Error("Impossible to reach line, possible unhandled case");
    }
  }

  // Retrieves a task based on its name
  getTask(name: string): Task | undefined {
    return this.tasks.find((task) => task.name === name);
  }

  // Deletes a task by its name
  deleteTask(name: string): string | void {
    // Retrieve task to delete based on its name
    const taskToDelete = this.getTask(name);

    // If task to delete is AntiTask
    if (taskToDelete instanceof AntiTask) {
      // Find other tasks that overlap with the AntiTask
      const overlapTasks = this.tasks.filter(
        (task) =>
          task.taskType !== "Cancellation" &&
          task.startDate === taskToDelete.startDate &&
          task.startTime === taskToDelete.startTime
      );

      // If there are overlapping tasks other than Cancellation tasks
      if (overlapTasks.length > 1) {
        // Return error about the overlap
        return `Deleting this anti-task creates an overlap between tasks: ${overlapTasks[0].name} and ${overlapTasks[1].name}.`;
      }
    }

    // If the task to delete is RecurringTask
    if (taskToDelete instanceof RecurringTask) {
      // Find the related AntiTask
      const relatedAntiTask = this.tasks.find(
        (task) =>
          task.taskType === "Cancellation" &&
          task.startDate === taskToDelete.startDate &&
          task.startTime === taskToDelete.startTime
      );
      
      // If a related AntiTask is found
      if (relatedAntiTask) {
        // Remove the related AntiTask from the tasks array
        this.tasks = this.tasks.filter(
          (task) =>
            !(
              task.taskType === "Cancellation" &&
              task.startDate === taskToDelete.startDate &&
              task.startTime === taskToDelete.startTime
            )
        );
      }
    }

    // Remove the task from the tasks array based on its name
    this.tasks = this.tasks.filter((task) => task.name !== name);
  }

  // Verifies that the task name is unique 
  verifyUniqueName(name: string): boolean {
    return !this.tasks.some((task) => task.name === name);
  }

  // Checks for overlapping tasks 
  verifyNoOverlap(
    taskClass: "transient" | "anti" | "recurring",
    startDate: number,
    startTime: number,
    duration: number,
    endDate?: number, // Optional end date for recurring
    frequency?: Frequency // Optional frequency for recurring 
  ): true | string { // Return either true if no overlap or a string indicating conflict
    // Check for overlapping transient tasks
    switch (taskClass) {
      case "transient":
        // Go through tasks to check for overlap
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
                  aTask instanceof AntiTask &&
                  aTask.startDate === task.startDate &&
                  aTask.startTime === task.startTime &&
                  aTask.duration === task.duration
              )
            ) {
              continue;
            }
            // Return error indicating conflict
            return `New ${taskClass} task conflicts with existing ${task.taskType} "${task.name}" on ${getDateTime(
              task.startDate,
              task.startTime
            )}.`;
          }
        }
        // No conflicts, return true
        return true;
      case "recurring":
        for (const task of this.tasks) {
          // Skip if anti-task
          if (task instanceof AntiTask) continue;
          // Skip if the task we're checking is a recurring task that's cancelled out
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
          // Check if the task frequency matches the recurring task frequency 
          if (
            Frequency.Daily ||
            (frequency === Frequency.Weekly && dayOfTheWeek(startDate) === dayOfTheWeek(endDate ?? -1)) ||
            (frequency === Frequency.Monthly && getDayOfMonth(task.startDate) === getDayOfMonth(startDate))
          ) {
            // Check for overlapping time
            if (startTime < task.startTime + task.duration && task.startDate < startTime + duration) {
              // Return error message
              return `New recurring tasks conflicts with existing ${task.taskType} task "${task.name}" at ${getDateTime(
                task.startDate,
                task.startTime
              )}`;
            }
          }
        }
        // No conflicts, return true
        return true;
      case "anti":
        // Check for existing antitask (we don't need to check duration)
        for (const antiTask of this.tasks.filter((task): task is AntiTask => task instanceof AntiTask)) {
          // Check if antitask matches start date, start time, and duration
          if (startDate === antiTask.startDate && startTime === antiTask.startTime && duration === antiTask.duration) {
            // Error message about conflict
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
            // Return true if matching recurring task found
            return true;
          }
        }
        // Return error indicating no matching recurring
        return `Unable to find recurring task that starts at ${getDateTime(
          startDate,
          startTime
        )} and lasts for ${duration} minutes`;
    }
  }

  // Verifies if the date is valid
  verifyValidDate(date: number): true | string {
    // Check if date is in correct format
    if (date >= 100000000) {
      return "Invalid date length. Date format must be YYYYMMDD.";
    }

    // Extract day, month, year from given date
    const day = getDigit(date, 1) + getDigit(date, 2) * 10;
    const month = getDigit(date, 3) + getDigit(date, 4) * 10;
    const year = (date - (month * 100 + day)) / 10 ** 4;

    // CHeck if theday exceeds number of days in given month
    if (day > getDaysInMonth(month, year)) {
      return "Invalid day: given day exceeds the number of days in given month";
    }

    // Check if month exceeds 12
    if (month > 12) {
      return "Invalid month: given month exceeds 12";
    }

    // Return true if all checks pass
    return true;
  }

  // Writes schedule to JSON file
  writeScheduleToFile(fileName: string, startDate: number, type: "day" | "week" | "month" | "whole"): void {
    try {
      // Convert tasks to an array of tasks 
      let tasksArray;
      if (type !== "whole") {
        tasksArray = Object.values(this.getSchedule(startDate, type));
      } else {
        tasksArray = Object.values(this.tasks);
      }

      // Filter out recurring tasks canceled out by anti-tasks
      const filteredRecurringTasks = tasksArray.filter((task) => {
        if (task instanceof RecurringTask) {
          // Check if there exists an anti-task that cancels this recurring task
          const antiTaskExists = tasksArray.some(
            (antiTask) =>
              antiTask instanceof AntiTask &&
              antiTask.startDate === task.startDate &&
              antiTask.startTime === task.startTime &&
              antiTask.duration === task.duration
          );
          return !antiTaskExists; // Keep the recurring task if no corresponding anti-task is found
        }
        return true; // Keep non-recurring tasks
      });

      // Filter out antitasks from list of filtered recurring tasks
      const filteredRecurringTasksWithoutAntiTasks = filteredRecurringTasks.filter(
        (task) => !(task instanceof AntiTask)
      );

      // Sort the array by startDate
      filteredRecurringTasksWithoutAntiTasks.sort((a, b) => {
        // Convert the numbers to strings for comparison
        const startDateA = a.startDate.toString();
        const startDateB = b.startDate.toString();

        if (startDateA < startDateB) {
          return -1;
        }
        if (startDateA > startDateB) {
          return 1;
        }
        return 0;
      });

      // Modify keys and values as needed
      const modifiedTasks = filteredRecurringTasksWithoutAntiTasks.map((task) => {
        if (task instanceof RecurringTask) {
          // Format RecurringTask differently
          return {
            Name: task.name,
            Type: task.taskType,
            StartDate: task.startDate,
            StartTime: task.startTime,
            Duration: task.duration,
            EndDate: task.endDate,
            Frequency: task.frequency,
          };
        } else {
          // Format other tasks (Transient tasks) differently
          return {
            Name: task.name,
            Type: task.taskType,
            Date: task.startDate,
            StartTime: task.startTime,
            Duration: task.duration,
          };
        }
      });

      // Convert tasks array to prettified JSON string with 2 spaces indentation
      const scheduleData = JSON.stringify(modifiedTasks, null, 2);

      // Create a Blob from the JSON data
      const blob = new Blob([scheduleData], { type: "application/json" });

      // Save the blob as a file
      saveAs(blob, fileName);

      // Log success message
      console.log(`Schedule saved to file '${fileName}' successfully.`);
    } catch (error) {
      // Log error message if an exception occurs
      console.error(`Error saving schedule to file '${fileName}':`, error);
    }
  }

  // Retrives tasks based on the specified start date and type
  getSchedule(startDate: number, type: "day" | "week" | "month" | "calendar"): Task[] {
    // Intialize variables for new start date and end date
    let newStartDate = startDate;
    let endDate: number;

    // Determine end date based on specified type
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
      case "calendar":
        // Get previous and next month
        newStartDate -= 100;
        endDate = startDate + 131;
        break;
      default:
        // Throw error if invalid type 
        throw new Error("Invalid type specified");
    }

    // Filter tasks based on the range specified 
    return this.tasks.filter((task) => {
      return task.startDate >= newStartDate && task.startDate < endDate;
    });
  }

  // Reads schedule data from file
  readScheduleFromFile(file: File): void {
    // Create new FileReader object
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      // Check if FileReader loaded file successfully
      if (event.target) {
        // Initialize array to store names of added tasks
        const addedTasks: string[] = [];
        try {
          // Parse JSON data from file
          const fileData = JSON.parse(event.target.result as string);
          // Decode the JSON from the file
          const data = decodeJSON(fileData);
          // Go through each task data from the decoded JSON
          for (const taskData of data) {
            if (TransientObject.is(taskData)) {
              // Destructure data
              const { Name, Type, StartTime, Date, Duration } = taskData;
              // Add the transient task
              const result = this.controller?.addTask(Name, "transient", StartTime, Date, Duration, Type);
              // If the result is not true, throw error
              if (result !== true) {
                throw new Error(result);
              }
              // Push the name of the added task to the array
              addedTasks.push(Name);
            } else if (AntiObject.is(taskData)) {
              // Destructure data
              const { Name, Type, StartTime, Date, Duration } = taskData;
              // Add the anti-task
              const result = this.controller?.addTask(Name, "anti", StartTime, Date, Duration, Type);
              // If the result is not true, throw error
              if (result !== true) {
                throw new Error(result);
              }
              // Push the name of the added task to the array
              addedTasks.push(Name);
            } else {
              // Destructure data
              const { Name, Type, StartTime, StartDate, EndDate, Frequency, Duration } = taskData;
              // Add the recurring task
              const result = this.controller?.addTask(
                Name,
                "recurring",
                StartTime,
                StartDate,
                Duration,
                Type,
                EndDate,
                Frequency ? numberToFrequency(Frequency) : undefined
              );
              // If the result is not true, throw an error
              if (result !== true) {
                throw new Error(result);
              }
              // Push name of added task to array
              addedTasks.push(Name);
            }
          }

          // Log sucess if schedule is loaded properly
          console.log(`Schedule from file '${file.name}' loaded successfully.`);
        } catch (error) {
          // Delete added tasks if an error occurs during processing
          addedTasks.forEach((taskName) => {
            this.deleteTask(taskName);
          });
          // Log the error message
          console.error(`Error in '${file.name}':`, error);
        }
      }
    };

    // Read the file as text
    fileReader.readAsText(file);
  }
}
