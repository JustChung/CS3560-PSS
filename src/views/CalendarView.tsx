import { Calendar } from "rsuite";
import PSSController from "../classes/PSSController";
import { useState, useCallback, ReactElement } from "react";
import { getTime } from "../utils";
import { useForceRerender } from "../hooks/useForceRerender";
import { Button, Chip, ChipOwnProps, Popover, Stack, Typography } from "@mui/material";
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

const TaskChip = ({ task, tasks }: { task: TransientTask | RecurringTask; tasks: Task[] }) => {
  return (
    <Chip
      variant='outlined'
      color={getTaskColor(task, tasks)}
      size='small'
      sx={{ display: "flex", justifyContent: "flex-start" }}
      label={
        <Typography variant='body2' noWrap>
          <b>{getTime(task.startTime)}</b> - {task.name}
        </Typography>
      }
    />
  );
};

const MoreTasks = ({ tasks, text }: { tasks: (TransientTask | RecurringTask)[]; text: string }) => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchor(null);
  }, []);

  return (
    <>
      <Button variant='text' onClick={handleClick} size='small' fullWidth sx={{ fontSize: 11 }}>
        {text}
      </Button>
      <Popover
        open={Boolean(anchor)}
        onClose={handleClose}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}>
        {tasks.map((task, index) => (
          <TaskChip task={task} tasks={tasks} key={index} />
        ))}
      </Popover>
    </>
  );
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
        const taskItems = <MoreTasks tasks={displayTasks.slice(2)} text={moreCount + " more..."} />;

        return (
          <Stack>
            {displayTasks.slice(0, 2).map((task, index) => (
              <TaskChip task={task} key={index} tasks={tasks} />
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
