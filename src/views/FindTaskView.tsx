import React from "react";
import PSSController from "../types/PSSController";

interface FindTaskViewProps {
  controller: PSSController;
}

const FindTaskView: React.FC<FindTaskViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>FindTask View</h2>
    </div>
  );
};

export default FindTaskView;
