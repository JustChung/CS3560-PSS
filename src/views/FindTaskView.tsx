import { useCallback, useEffect, useState } from "react";
import PSSController from "../classes/PSSController";
import Task from "../classes/Task";
import { Box, TextField, Typography } from "@mui/material";
import { RecurringTask } from "../classes/RecurringTask";
import { getDate, getTime } from "../utils";

interface FindTaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FindTaskView: React.FC<FindTaskViewProps> = ({ controller }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [input, setInput] = useState("");

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(event?.target.value);
  }, []);

  useEffect(() => {
    const fetchedTask = controller.viewTask(input);
    if (fetchedTask) {
      setTask(fetchedTask);
    } else {
      setTask(null);
    }
  }, [controller, input]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <TextField type='text' value={input} onChange={handleInputChange} fullWidth sx={{ mb: 3 }} />
      {task && (
        <Box width='90%'>
          <Typography variant='h4'>{`${task.name} [${task.taskType}]`}</Typography>
          <Typography variant='subtitle1' fontWeight={600}>
            {task.constructor.name}
          </Typography>

          <Typography variant='body1'>{`Time: ${getTime(task.startTime)} - ${getTime(
            task.startTime + task.duration
          )}`}</Typography>
          <Typography variant='body1'>
            {`Date: ${getDate(task.startDate)}`}
            {task instanceof RecurringTask && ` - ${getDate(task.endDate)}`}
          </Typography>
          {task instanceof RecurringTask && <Typography variant='body1'>{"Frequency: " + task.frequency}</Typography>}
        </Box>
      )}
      {!task && input === "" && <Typography>Enter a task name to search for a task...</Typography>}
      {!task && input !== "" && <Typography>Unable to find task by the name "{input}"</Typography>}
    </Box>
  );
};

export default FindTaskView;
