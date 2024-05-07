import { useState, useEffect, useCallback } from "react";
import PSSController from "../classes/PSSController";
import { Alert, Box, Button, Container, Divider, MenuItem, Select, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTimePicker } from "../hooks/useTimePicker";
import Task from "../classes/Task";
import dayjs from "dayjs";

interface ScheduleViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScheduleView: React.FC<ScheduleViewProps> = ({ controller }) => {
  const [startDate, setStartDate] = useTimePicker(dayjs());
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("day");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const hideError = useCallback((_ev: unknown, reason: SnackbarCloseReason) => {
    if (reason !== "clickaway") setShowError(false);
  }, []);

  const handleViewSchedule = useCallback(() => {
    const numericStartDate = parseInt(startDate.format("YYYYMMDD"));
    const retrievedTasks = controller.viewSchedule(numericStartDate, scheduleType);
    setTasks(retrievedTasks || []);
  }, [controller, scheduleType, startDate]);

  const handleDeleteTask = (name: string) => {
    const taskDeleted = controller.deleteTask(name);
    if (taskDeleted) {
      setErrorText(taskDeleted);
      setShowError(true);
    }
    handleViewSchedule();
  };

  useEffect(() => {
    handleViewSchedule();
  }, [startDate, scheduleType, handleViewSchedule]);

  return (
    <Box>
      <Typography variant='h4' textAlign={'center'}>Schedule View</Typography>
      <Divider sx={{ my: 2 }} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label='Start Date' sx={{ my: 2 }} value={startDate} onChange={setStartDate} />
      </LocalizationProvider>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant='h5'>Schedule Type:</Typography>
        <Select sx={{ minWidth: 95, maxHeight: 40, ml: 1 }}
          id='scheduleType'
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value as "day" | "week" | "month")}>
          <MenuItem value='day'>Day</MenuItem>
          <MenuItem value='week'>Week</MenuItem>
          <MenuItem value='month'>Month</MenuItem>
        </Select>
      </Box>
      <Button variant='outlined' onClick={handleViewSchedule} sx={{ width: 160, height: 50}}>View Schedule</Button>
      <Divider sx={{ m: 2 }} />
      <Box>
        {tasks.map((task, index) => (
          <Container key={index} sx={{ my: 2 }}>
            <Typography variant='body1' sx={{ color: '#3b3b3b'}}>{`Start Time: ${task.startTime}`}</Typography>
            <Typography variant='body1' sx={{ color: '#3b3b3b'}}>{`Event Name: ${task.name}`}</Typography>
            <Typography variant='body1' sx={{ color: '#3b3b3b'}}>{`Type of Task: ${task.taskType}`}</Typography>
            <Button variant='outlined' sx={{ borderColor: 'red', color: 'red', width: 150, height: 40, mt: 0.5 }} onClick={() => handleDeleteTask(task.name)}>Delete</Button>
            {index !== tasks.length - 1 && <Divider sx={{ m: 2 }}/>}
          </Container>
        ))}
      </Box>
      <Snackbar open={showError} autoHideDuration={6000} onClose={hideError}>
        <Alert severity='error' variant='filled' sx={{ width: "100%" }}>
          {errorText}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduleView;
