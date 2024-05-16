// Abstract class representing task
abstract class Task<T extends string = string> {
  // Properties of task
  name: string; // Name of task
  taskType: T; // Type of task (TransientTask, AntiTask, RecurringTask)
  startTime: number; // Start time of task
  startDate: number; // Start date of task
  duration: number; // Duration of the task

  // Constructor to intitilize
  constructor(name: string, type: T, startTime: number, startDate: number, duration: number) {
    this.name = name;
    this.taskType = type;
    this.startTime = startTime;
    this.startDate = startDate;
    this.duration = duration;
  }

  // Method to edit a specific properly of the task
  editTask<K extends keyof this>(property: K, newValue: this[K]): void {
    // Update the specified property with new value
    this[property] = newValue as this[K];
  }

  // Method to append task to task array
  appendTo(taskArr: Task[]): void {
    // Add task to provided task array
    taskArr.push(this);
  }
}

export default Task;
