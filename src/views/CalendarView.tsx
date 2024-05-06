import { Whisper, Popover, Calendar } from "rsuite";
import PSSController from "../classes/PSSController";
import { useState, useCallback } from "react";
import { getTime } from "../utils";
import { useForceRerender } from "../hooks/useForceRerender";
import { Chip, ChipOwnProps, Stack, Typography } from "@mui/material";
import Task from "../classes/Task";
import { TransientTask } from "../classes/TransientTask";
import { AntiTask } from "../classes/AntiTask";
import { RecurringTask } from "../classes/RecurringTask";

const getTaskColor = (task: TransientTask | RecurringTask, tasks: Task[]): ChipOwnProps["color"] => {
  if (task instanceof TransientTask) {
    return "secondary";
  }

  if (
    tasks.some(
      (aTask) =>
        aTask instanceof AntiTask &&
        aTask.startDate === task.startDate &&
        aTask.startTime === task.startTime &&
        aTask.duration === task.duration
    )
  ) {
    return "error";
  }

  // Uncancelled recurring tasks
  return "primary";
};

export const CalendarView = ({ controller }: { controller: PSSController }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2020, 3));

  const tasks = controller.viewSchedule(currentMonth.getFullYear() * 10000 + currentMonth.getMonth() * 100, "calendar");

  // Forces the calendar to continuously refresh
  const forceRerender = useForceRerender();
  setTimeout(forceRerender, 1000);

  const handleCellRender = useCallback(
    (date: Date) => {
      const displayTasks = tasks
        .filter((task): task is TransientTask | RecurringTask => {
          // irc: formats the task's startDate to a date object by conversion to string, then parsing year, month, day
          const dateString: string = task.startDate.toString();
          const year: number = parseInt(dateString.substring(0, 4));
          const month: number = parseInt(dateString.substring(4, 6)) - 1;
          const day: number = parseInt(dateString.substring(6, 8));
          const taskDate = new Date(year, month, day);
          return (
            taskDate.getFullYear() === date.getFullYear() &&
            taskDate.getMonth() === date.getMonth() &&
            taskDate.getDate() === date.getDate() &&
            !(task instanceof AntiTask)
          );
        })
        .sort((a, b) => a.startTime - b.startTime);

      const moreCount = displayTasks.length > 2 ? displayTasks.length - 2 : 0;
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
          <Stack>
            {displayTasks.slice(0, 2).map((task, index) => (
              <Chip
                variant='outlined'
                color={getTaskColor(task, tasks)}
                size='small'
                key={index}
                sx={{ display: "flex", justifyContent: "flex-start" }}
                label={
                  <Typography variant='body2' key={index} noWrap>
                    <b>{getTime(task.startTime)}</b> - {task.name}
                  </Typography>
                }></Chip>
            ))}
            {moreCount ? taskItems : null}
          </Stack>
        );
      }

      // no tasks: return null
      return null;
    },
    [tasks]
  );

  return (
    <Calendar bordered renderCell={handleCellRender} onMonthChange={setCurrentMonth} defaultValue={currentMonth} />
  );
};
