import React from "react";
import PSSController from "../classes/PSSController";

interface CreateTaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreateTaskView: React.FC<CreateTaskViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>Schedule View</h2>
    </div>
  );
};

export default CreateTaskView;
