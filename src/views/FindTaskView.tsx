import React, { useCallback, useState } from "react";
import PSSController from "../classes/PSSController";
import Task from "../classes/Task";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";

interface FindTaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FindTaskView: React.FC<FindTaskViewProps> = ({ controller }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [task, setTask] = useState<Task | null>(null);  
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const hideError = useCallback((_ev: unknown, reason: SnackbarCloseReason) => {
    if (reason !== "clickaway") setShowError(false);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleFindTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search Query:", searchQuery);

    // You can perform further actions, such as calling a function passed from props
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
  return (
    <div>
      <h2>FindTask View</h2>
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

export default FindTaskView;
