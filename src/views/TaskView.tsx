import PSSController from "../classes/PSSController";
import { Box, Divider, Typography } from "@mui/material";

interface TaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskView: React.FC<TaskViewProps> = ({ controller }) => {
  return (
    <Box>
      <Typography variant='h4' textAlign={'center'}>Task View</Typography>
      <Divider sx={{ m: 2 }} />
    </Box>
  );
};

export default TaskView;
