import React from "react";
import PSSController from "../types/PSSController";

interface ScheduleViewProps {
  controller: PSSController;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>Schedule View</h2>
    </div>
  );
};

export default ScheduleView;
