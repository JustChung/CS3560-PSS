import React from "react";
import PSSController from "../classes/PSSController";

interface FindTaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FindTaskView: React.FC<FindTaskViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>FindTask View</h2>
    </div>
  );
};

export default FindTaskView;
