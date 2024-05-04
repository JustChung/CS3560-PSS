import React, { useCallback, useEffect, useMemo } from "react";
import PSSController from "../classes/PSSController";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
} from "@mui/material";
import { useRadioGroupState } from "../hooks/useRadioGroupState";
import { TransientTaskType } from "../classes/TransientTask";
import { AntiTaskType } from "../classes/AntiTask";
import { RecurringTaskType } from "../classes/RecurringTask";
import { useTextFieldState } from "../hooks/useTextFieldState";
import { useSliderState } from "../hooks/useSliderState";

interface CreateTaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreateTaskView: React.FC<CreateTaskViewProps> = ({ controller }) => {
  const [taskClass, setTaskClass] = useRadioGroupState("transient");
  const [name, setName] = useTextFieldState("");
  const [taskType, setTaskType] = useRadioGroupState("");

  const [startTime, setStartTime] = useTextFieldState("0000");
  const [duration, setDuration] = useSliderState(0);

  const [startDate, setStartDate] = useTextFieldState("0000");
  const [endDate, setEndDate] = useTextFieldState("0000");

  const [frequency, setFrequency] = useRadioGroupState("daily");

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

  const createTask = useCallback(() => {
    controller.addTask(
      name,
      taskClass as "transient" | "anti" | "recurring",
      parseInt(startTime),
      parseInt(startDate),
      duration,
      taskType as TransientTaskType | AntiTaskType | RecurringTaskType
    );
    // TODO (luciano): add recurring tasks
  }, [controller, duration, name, startDate, startTime, taskClass, taskType]);

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
        <FormLabel sx={{ mt: 1 }}>Duration</FormLabel>
        <Slider
          defaultValue={60}
          step={15}
          valueLabelDisplay='on'
          min={0}
          max={180}
          value={duration}
          onChange={setDuration}
        />

        <Divider sx={{ m: 3 }} />
        <FormLabel sx={{ mt: 1 }}>Start Date</FormLabel>
        <TextField inputMode='numeric' value={startDate} onChange={setStartDate} />
        <FormLabel sx={{ mt: 1 }}>End Date</FormLabel>
        <TextField inputMode='numeric' value={endDate} onChange={setEndDate} />

        <Divider sx={{ m: 3 }} />
        <FormLabel sx={{ mt: 1 }}>Frequency</FormLabel>
        <RadioGroup row onChange={setFrequency} value={frequency}>
          <FormControlLabel value='daily' control={<Radio />} label='Daily' />
          <FormControlLabel value='weekly' control={<Radio />} label='Weekly' />
          <FormControlLabel value='monthly' control={<Radio />} label='Monthly' />
        </RadioGroup>

        <Button onClick={createTask}>
          <p>Create Task</p>
        </Button>
      </FormControl>
    </Container>
  );
};

export default CreateTaskView;
