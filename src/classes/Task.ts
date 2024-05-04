abstract class Task<T extends string = string> {
  name: string;
  taskType: T;
  startTime: number;
  startDate: number;
  duration: number;

  constructor(name: string, type: T, startTime: number, startDate: number, duration: number) {
    this.name = name;
    this.taskType = type;
    this.startTime = startTime;
    this.startDate = startDate;
    this.duration = duration;
  }

  editTask<K extends keyof this>(property: K, newValue: this[K]): void {
    this[property] = newValue as this[K];
  }

  appendTo(taskArr: Task[]): void {
    taskArr.push(this);
  }
}

export default Task;
