import React from "react";
import PSSController from "../types/PSSController";

interface TaskViewProps {
  controller: PSSController;
}

const TaskView: React.FC<TaskViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>Task View</h2>
    </div>
  );
};

export default TaskView;
