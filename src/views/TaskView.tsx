import React, { useCallback, useEffect, useMemo, useState } from "react";
import PSSController from "../classes/PSSController";
import Task from "../classes/Task";
import {
  Alert,
  Button,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { useRadioGroupState } from "../hooks/useRadioGroupState";
import { useTextFieldState } from "../hooks/useTextFieldState";
import { useSliderState } from "../hooks/useSliderState";
import { useTimePicker } from "../hooks/useTimePicker";
import { TransientTaskType } from "../classes/TransientTask";
import { AntiTaskType } from "../classes/AntiTask";
import { Frequency, RecurringTask, RecurringTaskType } from "../classes/RecurringTask";
import { getDate, getTime } from "../utils";
import dayjs from "dayjs";

interface TaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskView: React.FC<TaskViewProps> = ({ controller }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [editClicked, setEditClicked] = useState("False");

  // for edit task
  const [taskClass, setTaskClass] = useRadioGroupState<"transient" | "anti" | "recurring">("transient");
  const [name, setName] = useTextFieldState("");
  const [taskType, setTaskType] = useRadioGroupState("");

  const [startTime, setStartTime] = useTimePicker(dayjs());
  const [duration, setDuration] = useSliderState(0.25);

  const [startDate, setStartDate] = useTimePicker(dayjs());
  const [endDate, setEndDate] = useTimePicker(dayjs());

  const [frequency, setFrequency] = useRadioGroupState<Frequency>(Frequency.Daily);

  const taskTypeOptions = useMemo(() => {
    switch (taskClass) {
      case "transient":
        return Object.values(TransientTaskType) as string[];
      case "anti":
        return Object.values(AntiTaskType) as string[];
      case "recurring":
        return Object.values(RecurringTaskType) as string[];
      default:
        return [];
    }
  }, [taskClass]);

  useEffect(() => {
    setTaskType(null, taskTypeOptions[0]);
  }, [setTaskType, taskTypeOptions]);

  useEffect(() => {
    const fetchedTask = controller.viewTask(searchQuery);
    if (fetchedTask) {
      setTask(fetchedTask);
    } else {
      setTask(null);
    }
  }, [controller, searchQuery]);

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const hideError = useCallback((_ev: unknown, reason: SnackbarCloseReason) => {
    if (reason !== "clickaway") setShowError(false);
  }, []);
  const hideSuccess = useCallback((_ev: unknown, reason: SnackbarCloseReason) => {
    if (reason !== "clickaway") setShowSuccess(false);
  }, []);
  const hideDeleted = useCallback((_ev: unknown, reason: SnackbarCloseReason) => {
    if (reason !== "clickaway") setShowDeleted(false);
  }, []);

  const editTask = useCallback(() => {
    if (task === null) return;

    controller.printTasks();
    const taskPrev = task;
    controller.deleteTask(task.name);

    const result = controller.addTask(
      name,
      taskClass as "transient" | "anti" | "recurring",
      startTime.hour() + startTime.minute() / 60,
      parseInt(startDate.format("YYYYMMDD")),
      duration,
      taskType as TransientTaskType | AntiTaskType | RecurringTaskType,
      taskClass === "recurring" ? parseInt(endDate.format("YYYYMMDD")) : undefined,
      taskClass === "recurring" ? Frequency[frequency] : undefined
    );
    if (result !== true) {
      controller.addTask(
        taskPrev.name,
        taskClass as "transient" | "anti" | "recurring",
        taskPrev.startTime,
        taskPrev.startDate,
        taskPrev.duration,
        taskType as TransientTaskType | AntiTaskType | RecurringTaskType,
        // stuff with recurring tasks
        taskClass === "recurring" ? parseInt(endDate.format("YYYYMMDD")) : undefined,
        taskClass === "recurring" ? Frequency[frequency] : undefined
      );
      setErrorText(result);
      setShowError(true);
      setShowSuccess(false);
    } else {
      setShowError(false);
      setShowSuccess(true);
    }
    setEditClicked("False");
    setTask(null);
    setSearchQuery("");
    controller.printTasks();
  }, [controller, duration, endDate, frequency, name, startDate, startTime, taskClass, taskType]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchQuery(event?.target.value);
    setEditClicked("False");
  };

  const handleEditTask = () => {
    setEditClicked("True");
    console.log("Edit Task:", task);
  };

  const handleDeleteTask = () => {
    controller.printTasks();
    console.log("Delete Task:", task);
    {
      task && controller.deleteTask(task.name);
      setTask(null);
      setEditClicked("False");
      setShowDeleted(true);
      controller.printTasks();
    }
  };

  return (
    <Box>
      <Typography variant="h4" textAlign={"center"}>
        Task View
      </Typography>
      <Divider sx={{ my: 2 }} />
      <TextField
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      {task && (
        <Box width="100%">
          <Typography variant="h4">{`${task.name} [${task.taskType}]`}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            {task.constructor.name}
          </Typography>

          <Typography variant="body1">{`Time: ${getTime(task.startTime)} - ${getTime(
            task.startTime + task.duration
          )}`}</Typography>
          <Typography variant="body1">
            {`Date: ${getDate(task.startDate)}`}
            {task instanceof RecurringTask && ` - ${getDate(task.endDate)}`}
          </Typography>
          {task instanceof RecurringTask && <Typography variant="body1">{"Frequency: " + task.frequency}</Typography>}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            { editClicked === 'True' ? (
              <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                <Button onClick={handleDeleteTask} variant="outlined" color="error" sx={{ width: '18rem' }}>Delete</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                <Button onClick={handleEditTask} variant="outlined" color="primary" sx={{ width: '9rem' }}>Edit Task</Button>
                <Button onClick={handleDeleteTask} variant="outlined" color="error" sx={{ width: '9rem' }}>Delete Task</Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
      {!task && searchQuery === "" && <Typography>Enter a task name to search for a task...</Typography>}
      {!task && searchQuery !== "" && <Typography>Unable to find task by the name "{searchQuery}"</Typography>}

      <Divider sx={{ my: 2 }} />

      {editClicked === 'True' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl>
            <FormLabel>Type of Task</FormLabel>
            <RadioGroup row onChange={setTaskClass} value={taskClass}>
              <FormControlLabel value="transient" control={<Radio />} label="Transient Task" />
              <FormControlLabel value="anti" control={<Radio />} label="Anti-Task" />
              <FormControlLabel value="recurring" control={<Radio />} label="Recurring Task" />
            </RadioGroup>

            <Divider sx={{ m: 3 }} />
            <FormLabel sx={{ mt: 1 }}>Task Name</FormLabel>
            <TextField required value={name} onChange={setName} />
            <FormLabel sx={{ mt: 1 }}>Task Type</FormLabel>
            <RadioGroup row onChange={setTaskType} value={taskType}>
              {taskTypeOptions.map((taskType) => (
                <FormControlLabel key={taskType} value={taskType} control={<Radio />} label={taskType} />
              ))}
            </RadioGroup>

            <Divider sx={{ m: 3 }} />
            <TimePicker label='Start Time' value={startTime} onChange={setStartTime} />
            <FormLabel sx={{ mt: 1 }}>Duration (hours)</FormLabel>
            <Slider
              defaultValue={1}
              step={0.25}
              valueLabelDisplay="on"
              min={0.25}
              max={3}
              value={duration}
              onChange={setDuration}
            />

            <Divider sx={{ m: 3 }} />
            <DatePicker label='Start Date' sx={{ mt: 1 }} value={startDate} onChange={setStartDate} />
            {taskClass === "recurring" && <DatePicker label='End Date' value={endDate} onChange={setEndDate} sx={{ mt: 3 }} />}

            {taskClass === "recurring" && (
              <>
                <Divider sx={{ m: 3 }} />
                <FormLabel sx={{ mt: 1 }}>Frequency</FormLabel>
                <RadioGroup row onChange={setFrequency} value={frequency}>
                  <FormControlLabel
                    value={Frequency.Daily}
                    control={<Radio />}
                    label="Daily"
                  />
                  <FormControlLabel
                    value={Frequency.Weekly}
                    control={<Radio />}
                    label="Weekly"
                  />
                  <FormControlLabel
                    value={Frequency.Monthly}
                    control={<Radio />}
                    label="Monthly"
                  />
                </RadioGroup>
              </>
            )}

            <Button onClick={editTask} sx={{ mt: 1.5 }}>
              <p>Edit Task</p>
            </Button>
          </FormControl>
        </LocalizationProvider>
      )}

      <Snackbar open={showError} autoHideDuration={6000} onClose={hideError}>
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorText}
        </Alert>
      </Snackbar>
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={hideSuccess}>
        <Alert severity='success' variant='filled' sx={{ width: "100%" }}>
          Task edited successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={showDeleted} autoHideDuration={6000} onClose={hideDeleted}>
      <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
        Task deleted!
      </Alert>
    </Snackbar>
    </Box>
  );
};

export default TaskView;
