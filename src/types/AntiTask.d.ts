import Task from "./Task";

enum CancellationType {
  Cancellation = "Cancellation",
}

class AntiTask extends Task {
  cancellationType: CancellationType;

  constructor(
    name: string,
    startTime: number,
    startDate: number,
    duration: number,
    cancellationType: CancellationType
  ) {
    super(name, "Anti", startTime, startDate, duration);
    this.cancellationType = cancellationType;
  }

  verifyCancel(): boolean {
    return true;
  }
}

export { AntiTask, CancellationType };
