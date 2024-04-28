import Task from './Task';

export default class PSSModel {
    emailAddress: string;
    tasks: Task[];

    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
        this.tasks = [];
    }

    createTask(name: string, type: "Recurring" | "Transient" | "Anti", startTime: number, startDate: number, duration: number, endDate?: number, frequency?: number): void {
        const task = new Task(name, type, startTime, startDate, duration);
        this.tasks.push(task);
    }    

    getTask(name: string): Task | undefined {
        return this.tasks.find(task => task.name === name);
    }

    deleteTask(name: string): void {
        this.tasks = this.tasks.filter(task => task.name !== name);
    }

    verifyUniqueName(name: string): boolean {
        return !this.tasks.some(task => task.name === name);
    }

    verifyNoOverlap(startDate: number, startTime: number, duration: number): boolean {
        // NEED TO IMPLEMENT
        return true;
    }

    writeScheduleToFile(fileName: string): void {
        // NEED TO IMPLEMENT
    }

    getSchedule(startDate: number, type: 'day' | 'week' | 'month'): Task[] {
        let endDate: number;
        if (type === 'day') {
            endDate = startDate + 1;
        } else if (type === 'week') {
            endDate = startDate + 7;
        } else if (type === 'month') {
            endDate = startDate + 30; // Need to change based on what month it is
        } else {
            throw new Error('Invalid type specified');
        }
    
        return this.tasks.filter(task => {
            return task.startDate >= startDate && task.startDate < endDate;
        });
    }    

    writePartialScheduleToFile(fileName: string, startDate: number, type: 'day' | 'week' | 'month'): void {
        // NEED TO IMPLEMENT
    }

    readScheduleFromFile(fileName: string): void {
        // NEED TO IMPLEMENT
    }
}
