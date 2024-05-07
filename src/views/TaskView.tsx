import React, { useCallback, useEffect, useMemo, useState } from "react";
import PSSController from "../classes/PSSController";
import Task from "../classes/Task";
import { 
  Alert, 
  Button, 
  Container, 
  Divider, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  Radio, 
  RadioGroup, 
  Slider, 
  Snackbar, 
  SnackbarCloseReason, 
  TextField 
} from "@mui/material";
import { useRadioGroupState } from "../hooks/useRadioGroupState";
import PSSModel from "../classes/PSSModel";
import { useTextFieldState } from "../hooks/useTextFieldState";
import { useSliderState } from "../hooks/useSliderState";
import { Frequency, RecurringTaskType } from "../classes/RecurringTask";
import { TransientTaskType } from "../classes/TransientTask";
import { AntiTaskType } from "../classes/AntiTask";

interface TaskViewProps {
  controller: PSSController;
  model: PSSModel;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskView: React.FC<TaskViewProps> = ({ controller, model }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [task, setTask] = useState<Task | null>(null);
  const [editClicked, setEditClicked] = useState('False');

  // for edit task
  const [taskClass, setTaskClass] = useRadioGroupState<"transient" | "anti" | "recurring">("transient");
  const [name, setName] = useTextFieldState("");
  const [taskType, setTaskType] = useRadioGroupState("");

  const [startTime, setStartTime] = useTextFieldState("0000");
  const [duration, setDuration] = useSliderState(0.25);

  const [startDate, setStartDate] = useTextFieldState("0000");
  const [endDate, setEndDate] = useTextFieldState("0000");

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

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const hideError = useCallback((_ev: unknown, reason: SnackbarCloseReason) => {
    if (reason !== "clickaway") setShowError(false);
  }, []);

  const editTask = useCallback(() => {
    setEditClicked('True');
    controller.printTasks();

    const taskPrev = task;
    controller.deleteTask(task.name);

    const result = controller.addTask(
      name,
      taskClass as "transient" | "anti" | "recurring",
      parseInt(startTime),
      parseInt(startDate),
      duration,
      taskType as TransientTaskType | AntiTaskType | RecurringTaskType,
      taskClass === "recurring" ? parseInt(endDate) : undefined,
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
        taskClass === "recurring" ? parseInt(endDate) : undefined,
        taskClass === "recurring" ? Frequency[frequency] : undefined

      );
      setErrorText(result);
      setShowError(true);
    }
    setEditClicked('False');
    setTask(null);
    controller.printTasks();

  }, [controller, duration, endDate, frequency, name, startDate, startTime, taskClass, taskType]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleFindTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search Query:", searchQuery);

    try {
      const fetchedTask = controller.viewTask(searchQuery);
      if (fetchedTask) {
        setTask(fetchedTask);
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      console.error(error);
      setErrorText(`Task with name "${searchQuery}" not Found`);
      setShowError(true);
    }

    // Reset the input field after submitting the form
    setSearchQuery('');
  };

  const handleEditTask = () => {
    setEditClicked('True');
    console.log("Edit Task:", task);
  };

  const handleDeleteTask = () => {
    controller.printTasks();
    console.log("Delete Task:", task);
    controller.deleteTask(task.name);
    setTask(null);
    controller.printTasks();
  };



  return (
    <div>
      <h2>Task View</h2>
      <form onSubmit={handleFindTask}>
        <input 
          placeholder="Search Task" 
          type="text"
          value={searchQuery}
          onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      { task !== null && (
        <div className='task-container'>
        <div className='event'>
          <div className='event-time'>{"Start Time: " + task?.startTime}</div>
          <div className='event-details'>
            <div className='event-title'>{"Event Name: " + task?.name}</div>
            <div className='event-description'>{"Type of Task: " + task?.taskType}</div>
          </div>
        </div>

        <Button onClick={handleEditTask} variant="contained" color="primary">
          Edit
        </Button>
        <Button onClick={handleDeleteTask} variant="contained" color="error">
          Delete
        </Button>

        { editClicked === 'True' && (
          <Container>
          <FormControl>
            <FormLabel>Type of Task</FormLabel>
            <RadioGroup row onChange={setTaskClass} value={taskClass}>
              <FormControlLabel value='transient' control={<Radio />} label='Transient Task' />
              <FormControlLabel value='anti' control={<Radio />} label='Anti-Task' />
              <FormControlLabel value='recurring' control={<Radio />} label='Recurring Task' />
            </RadioGroup>

            <Divider sx={{ m: 3 }} />
            <FormLabel sx={{ mt: 1 }}>Task Name</FormLabel>
            <TextField required value={name} onChange={setName} />
            <FormLabel sx={{ mt: 1 }}>Task Type</FormLabel>
            <RadioGroup row onChange={setTaskType} value={taskType}>
              {taskTypeOptions.map((taskType) => (
                <FormControlLabel value={taskType} control={<Radio />} label={taskType} />
              ))}
            </RadioGroup>

            <Divider sx={{ m: 3 }} />
            <FormLabel sx={{ mt: 1 }}>Start Time</FormLabel>
            <TextField inputMode='numeric' value={startTime} onChange={setStartTime} />
            <FormLabel sx={{ mt: 1 }}>Duration (hours)</FormLabel>
            <Slider
              defaultValue={1}
              step={0.25}
              valueLabelDisplay='on'
              min={0.25}
              max={3}
              value={duration}
              onChange={setDuration}
            />

            <Divider sx={{ m: 3 }} />
            <FormLabel sx={{ mt: 1 }}>Start Date</FormLabel>
            <TextField inputMode='numeric' value={startDate} onChange={setStartDate} />
            {taskClass === "recurring" && (
              <>
                <FormLabel sx={{ mt: 1 }}>End Date</FormLabel>
                <TextField inputMode='numeric' value={endDate} onChange={setEndDate} />
              </>
            )}

            {taskClass === "recurring" && (
              <>
                <Divider sx={{ m: 3 }} />
                <FormLabel sx={{ mt: 1 }}>Frequency</FormLabel>
                <RadioGroup row onChange={setFrequency} value={frequency}>
                  <FormControlLabel value={Frequency.Daily} control={<Radio />} label='Daily' />
                  <FormControlLabel value={Frequency.Weekly} control={<Radio />} label='Weekly' />
                  <FormControlLabel value={Frequency.Monthly} control={<Radio />} label='Monthly' />
                </RadioGroup>
              </>
            )}

            <Button onClick={editTask}>
              <p>Edit Task</p>
            </Button>
            <Snackbar open={showError} autoHideDuration={6000} onClose={hideError}>
              <Alert severity='error' variant='filled' sx={{ width: "100%" }}>
                {errorText}
              </Alert>
            </Snackbar>
          </FormControl>
          </Container>

        )}
      </div>
      )}

      <Snackbar open={showError} autoHideDuration={6000} onClose={hideError}>
        <Alert severity='error' variant='filled' sx={{ width: "100%" }}>
          {errorText}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default TaskView;
