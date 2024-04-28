class Task {
    name: string;
    type: 'Recurring' | 'Transient' | 'Anti';
    startTime: number;
    startDate: number;
    duration: number;

    constructor(name: string, type: 'Recurring' | 'Transient' | 'Anti', startTime: number, startDate: number, duration: number) {
        this.name = name;
        this.type = type;
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