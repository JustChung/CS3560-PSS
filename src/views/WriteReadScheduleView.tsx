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

  const handleExportSchedule = () => {
    controller.outputScheduleToFile("schedule.json");
  };

  return (
    <div>
      <h2>WriteReadScheduleView</h2>
      <input type="file" onChange={handleFileInputChange} />
      <br /><br />
      <button onClick={handleExportSchedule}>Export Schedule</button>
    </div>
  );
};

export default WriteReadScheduleView;
