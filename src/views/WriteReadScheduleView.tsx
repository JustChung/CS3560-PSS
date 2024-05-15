import React, { useState } from "react";
import PSSController from "../classes/PSSController";
import { Box, Button, Divider, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTimePicker } from "../hooks/useTimePicker";
import dayjs from "dayjs";

interface WriteReadScheduleViewProps {
  controller: PSSController;
}

const WriteReadScheduleView: React.FC<WriteReadScheduleViewProps> = ({ controller }) => {
  const [fileName, setFileName] = useState("");
  const [startDate, setStartDate] = useTimePicker(dayjs());
  const [scheduleType, setScheduleType] = useState<"whole" | "day" | "week" | "month">("whole");

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      controller.inputFileToSchedule(file);
    }
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleExportSchedule = () => {
    if (!fileName) {
      alert("Please enter a file name.");
      return;
    }

    const numericStartDate = parseInt(startDate.format("YYYYMMDD"));
    controller.writeScheduleToFile(fileName + ".json", numericStartDate, scheduleType)
    setFileName(""); // Clearing the file name input after export
  }

  return (
    <Box>
      <Typography variant='h4' textAlign={'center'}>Export Schedule</Typography>
      <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', mt: 2, mb: 3 }}>
        <input type='file' onChange={handleFileInputChange} id='file-input' style={{ display: "none" }} />
        <label htmlFor='file-input'>
          <Button variant='outlined' component='span'>
            Upload File
          </Button>
        </label>
      </Box>

      <Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant='h4' textAlign={'center'}>Export Schedule</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant='h5' sx={{my: 1 }}>Schedule Type:</Typography>
          <Select sx={{ minWidth: 95, maxHeight: 40, ml: 1 }}
            id='scheduleType'
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value as "whole" | "day" | "week" | "month")}>
            <MenuItem value='day'>Day</MenuItem>
            <MenuItem value='week'>Week</MenuItem>
            <MenuItem value='month'>Month</MenuItem>
            <MenuItem value='whole'>Whole</MenuItem>
          </Select>
        </Box>
        { scheduleType !== "whole" && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label='Start Date' sx={{ my: 2 }} value={startDate} onChange={setStartDate} />
        </LocalizationProvider>
        )}
        <Box sx={{ display: 'flex', gap: 2}}>
          <TextField
            sx={{my: 1 }}
            id="file-name"
            label="File Name"
            variant="outlined"
            value={fileName}
            onChange={handleFileNameChange}
          />
          <Button sx={{ height: 56, my: 1 }} variant='outlined' onClick={handleExportSchedule}>
            Export Schedule
          </Button>
        </Box>
      </Box>
      
    </Box>
  );
};

export default WriteReadScheduleView;