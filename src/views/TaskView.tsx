import PSSController from "../classes/PSSController";

interface TaskViewProps {
  controller: PSSController;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskView: React.FC<TaskViewProps> = ({ controller }) => {
  return (
    <div>
      <h2>Task View</h2>
    </div>
  );
};

export default TaskView;
