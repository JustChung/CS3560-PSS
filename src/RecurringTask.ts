import Task from './Task';

enum TaskType {
    Class = 'Class',
    Study = 'Study',
    Sleep = 'Sleep',
    Exercise = 'Exercise',
    Work = 'Work',
    Meal = 'Meal'
}

class RecurringTask extends Task {
    endDate: number;
    frequency: number;
    taskType: TaskType;

    constructor(name: string, startTime: number, startDate: number, duration: number, endDate: number, frequency: number, taskType: TaskType) {
        super(name, 'Recurring', startTime, startDate, duration);
        this.endDate = endDate;
        this.frequency = frequency;
        this.taskType = taskType;
    }
}

export { RecurringTask, TaskType };