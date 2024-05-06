import React, { useState, useEffect, useCallback } from "react";
import PSSController from "../classes/PSSController";
import Task from "../classes/Task";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import "rsuite/Calendar/styles/index.css";

interface ScheduleViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScheduleView: React.FC<ScheduleViewProps> = ({ controller }) => {
  const [startDate, setStartDate] = useState<number>(Date.now());
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("day");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleViewSchedule = useCallback(() => {
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0].replace(/-/g, "");
    const numericStartDate = parseInt(formattedStartDate, 10);
    const retrievedTasks = controller.viewSchedule(numericStartDate, scheduleType);
    setTasks(retrievedTasks || []);
  }, [controller, scheduleType, startDate]);

  useEffect(() => {
    handleViewSchedule();
  }, [startDate, scheduleType, handleViewSchedule]);

  const handleDeleteTask = (name: string) => {
    controller.deleteTask(name);
    handleViewSchedule();
  };

  const handleCellRender = (date: Date) => {
    const displayTasks = tasks.filter((task) => {
      // irc: formats the task's startDate to a date object by conversion to string, then parsing year, month, day
      const dateString: string = task.startDate.toString();
      const year: number = parseInt(dateString.substring(0, 4));
      const month: number = parseInt(dateString.substring(4, 6)) - 1;
      const day: number = parseInt(dateString.substring(6, 8));
      const taskDate = new Date(year, month, day);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });

    const moreCount = displayTasks.length > 1 ? displayTasks.length : 0;
    if (displayTasks.length) {
      const taskItems = (
        <li>
          <Whisper
            placement='top'
            trigger='click'
            speaker={
              <Popover>
                {tasks.map((task, index) => (
                  <p key={index}>
                    <b>{task.startTime}</b> - {task.name}
                  </p>
                ))}
              </Popover>
            }>
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );

      return (
        <ul className='calendar-todo-list'>
          {displayTasks.map((task, index) => (
            <li key={index}>
              <Badge /> <b>{task.startTime}</b> - {task.name}
            </li>
          ))}
          {moreCount ? taskItems : null}
        </ul>
      );
    }

    // no tasks: return null
    return null;
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
        <Calendar renderCell={handleCellRender} />
      </div>
    </div>
  );
};

export default ScheduleView;
