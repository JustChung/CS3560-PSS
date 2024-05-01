import React from "react";
import PSSController from "../classes/PSSController";

interface ScheduleViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScheduleView: React.FC<ScheduleViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>Schedule View</h2>
    </div>
  );
};

export default ScheduleView;
