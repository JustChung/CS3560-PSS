import React from "react";
import PSSController from "../classes/PSSController";
import { Box, Button, Stack } from "@mui/material";

interface WriteReadScheduleViewProps {
  controller: PSSController;
}

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
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Stack direction='row' gap={3}>
        <input type='file' onChange={handleFileInputChange} id='file-input' style={{ display: "none" }} />
        <label htmlFor='file-input'>
          <Button variant='outlined' component='span'>
            Upload File
          </Button>
        </label>
        <Button variant='outlined' onClick={handleExportSchedule}>
          Export Schedule
        </Button>
      </Stack>
    </Box>
  );
};

export default WriteReadScheduleView;
