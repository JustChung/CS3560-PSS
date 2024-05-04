import React, { useCallback, useEffect, useMemo, useState } from "react";
import PSSController from "../classes/PSSController";
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
  TextField,
} from "@mui/material";
import { useRadioGroupState } from "../hooks/useRadioGroupState";
import { TransientTaskType } from "../classes/TransientTask";
import { AntiTaskType } from "../classes/AntiTask";
import { Frequency, RecurringTaskType } from "../classes/RecurringTask";
import { useTextFieldState } from "../hooks/useTextFieldState";
import { useSliderState } from "../hooks/useSliderState";

interface CreateTaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreateTaskView: React.FC<CreateTaskViewProps> = ({ controller }) => {
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

  const createTask = useCallback(() => {
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
      setErrorText(result);
      setShowError(true);
    }
  }, [controller, duration, endDate, frequency, name, startDate, startTime, taskClass, taskType]);

  return (
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

        <Button onClick={createTask}>
          <p>Create Task</p>
        </Button>
        <Snackbar open={showError} autoHideDuration={6000} onClose={hideError}>
          <Alert severity='error' variant='filled' sx={{ width: "100%" }}>
            {errorText}
          </Alert>
        </Snackbar>
      </FormControl>
    </Container>
  );
};

export default CreateTaskView;
