import React from "react";
import PSSController from "../classes/PSSController";

interface WriteReadScheduleViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WriteReadScheduleView: React.FC<WriteReadScheduleViewProps> = ({ controller }) => {
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      controller.inputFileToSchedule(file);
    }
  };

  return (
    <div>
      <h2>WriteReadScheduleView</h2>
      <input type="file" onChange={handleFileInputChange} />
    </div>
  );
};

export default WriteReadScheduleView;
