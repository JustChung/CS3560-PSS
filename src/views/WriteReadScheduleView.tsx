import React from "react";
import PSSController from "../classes/PSSController";

interface WriteReadScheduleViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WriteReadScheduleView: React.FC<WriteReadScheduleViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>WriteReadScheduleView</h2>
    </div>
  );
};

export default WriteReadScheduleView;
