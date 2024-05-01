abstract class Task {
  name: string;
  type: "Recurring" | "Transient" | "Anti";
  startTime: number;
  startDate: number;
  duration: number;

  taskType: string;

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
