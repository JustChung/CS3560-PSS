import PSSModel from './PSSModel';
import Task from './Task';

export default class PSSController {
    pss: PSSModel;
    // view: MainView

    constructor(pss: PSSModel) {
        this.pss = pss;
    }

    addTask(name: string, type: string, startTime: number, startDate: number, duration: number, endDate?: number, frequency?: number): void {
        // NEED TO IMPLEMENT
    }

    deleteTask(name: string): void {
        this.pss.deleteTask(name);
    }

    viewTask(name: string): Task | undefined {
        return this.pss.getTask(name);
    }

    viewSchedule(startDate: number, type: 'day' | 'week' | 'month'): Task[] {
        return this.pss.getSchedule(startDate, type);
    }    

    outputScheduleToFile(fileName: string): void {
        this.pss.writeScheduleToFile(fileName);
    }

    writePartialScheduleToFile(fileName: string, startDate: number, type: 'day' | 'week' | 'month'): void {
        this.pss.writePartialScheduleToFile(fileName, startDate, type);
    }

    inputFileToSchedule(fileName: string): void {
        this.pss.readScheduleFromFile(fileName);
    }
}
