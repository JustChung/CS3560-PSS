import React, { useState } from "react";
import PSSController from "../classes/PSSController";
import { Box, Button, Stack, TextField } from "@mui/material";

interface WriteReadScheduleViewProps {
  controller: PSSController;
}

const WriteReadScheduleView: React.FC<WriteReadScheduleViewProps> = ({ controller }) => {
  const [fileName, setFileName] = useState("");

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      controller.inputFileToSchedule(file);
    }
  };

  const handleExportSchedule = () => {
    if (!fileName) {
      alert("Please enter a file name.");
      return;
    }
    controller.outputScheduleToFile(fileName + ".json");
    setFileName(""); // Clearing the file name input after export
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
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
        <TextField
          id="file-name"
          label="File Name"
          variant="outlined"
          value={fileName}
          onChange={handleFileNameChange}
        />
        <Button variant='outlined' onClick={handleExportSchedule}>
          Export Schedule
        </Button>
      </Stack>
    </Box>
  );
};

export default WriteReadScheduleView;