import { useMemo, useState } from "react";
import ScheduleView from "./ScheduleView";
import TaskView from "./TaskView";
import CreateTaskView from "./CreateTaskView";
import WriteReadScheduleView from "./WriteReadScheduleView";
import { CalendarView } from "./CalendarView";
import PSSController from "../classes/PSSController";
import { Box, Container, Stack, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

interface MainViewProps {
  controller: PSSController;
}

const MainView: React.FC<MainViewProps> = ({ controller }) => {
  const [displayedView, setDisplayedView] = useState("1");

  const handleChange = useMemo(
    () => (_ev: React.SyntheticEvent, newView: string) => {
      setDisplayedView(newView);
    },
    []
  );

  return (
    <Container maxWidth={false}>
      <Typography variant='h1'>PSS System</Typography>
      <Stack direction='row'>
        <Stack direction='column' width='30%'>
          <TabContext value={displayedView}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label='lab API tabs example'
                variant='scrollable'
                scrollButtons='auto'>
                <Tab label='View Schedule' value='1' />
                <Tab label='Task View' value='2' />
                <Tab label='Create Task' value='3' />
                <Tab label='Save/Read Schedules' value='4' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              <ScheduleView controller={controller} />
            </TabPanel>
            <TabPanel value='2'>
              <TaskView controller={controller} />
            </TabPanel>
            <TabPanel value='3'>
              <CreateTaskView controller={controller} />
            </TabPanel>
            <TabPanel value='4'>
              <WriteReadScheduleView controller={controller} />
            </TabPanel>
          </TabContext>
        </Stack>
        <CalendarView controller={controller} />
      </Stack>
    </Container>
  );
};

export default MainView;
