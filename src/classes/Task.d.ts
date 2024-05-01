abstract class Task<T extends string = string> {
  name: string;
  taskType: T;
  startTime: number;
  startDate: number;
  duration: number;

  constructor(
    name: string,
    type: "Recurring" | "Transient" | "Anti",
    startTime: number,
    startDate: number,
    duration: number
  ) {
    this.name = name;
    this.type = type;
    this.startTime = startTime;
    this.startDate = startDate;
    this.duration = duration;
  }

  abstract editTask<K extends keyof this>(property: K, newValue: this[K]): void;

  abstract appendTo(taskArr: Task[]): void;
}

export default Task;
