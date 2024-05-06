import React, { useState, useEffect } from "react";
import PSSController from "../classes/PSSController";
import Task from "../classes/Task";

interface ScheduleViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScheduleView: React.FC<ScheduleViewProps> = ({ controller }) => {
  const [startDate, setStartDate] = useState<number>(Date.now());
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("day");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleViewSchedule = () => {
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0].replace(/-/g, "");
    const numericStartDate = parseInt(formattedStartDate, 10);
    const retrievedTasks = controller.viewSchedule(numericStartDate, scheduleType);
    setTasks(retrievedTasks || []);
  };

  useEffect(() => {
    handleViewSchedule();
  }, [startDate, scheduleType, handleViewSchedule]);

  const handleDeleteTask = (name: string) => {
    controller.deleteTask(name);
    handleViewSchedule();
  };

  return (
    <div>
      <h2>Schedule View</h2>
      <div>
        <label htmlFor='startDate'>Start Date:</label>
        <input
          type='date'
          id='startDate'
          value={new Date(startDate).toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value).getTime())}
        />
      </div>
      <div>
        <label htmlFor='scheduleType'>Schedule Type:</label>
        <select
          id='scheduleType'
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value as "day" | "week" | "month")}>
          <option value='day'>Day</option>
          <option value='week'>Week</option>
          <option value='month'>Month</option>
        </select>
      </div>
      <button onClick={handleViewSchedule}>View Schedule</button>
      <div className='schedule-container'>
        {tasks.map((task, index) => (
          <div key={index} className='event'>
            <div className='event-time'>{"Start Time: " + task.startTime}</div>
            <div className='event-details'>
              <div className='event-title'>{"Event Name: " + task.name}</div>
              <div className='event-description'>{"Type of Task: " + task.taskType}</div>
            </div>
            <button onClick={() => handleDeleteTask(task.name)}>Delete</button>
            {index !== tasks.length - 1 && <br />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;
