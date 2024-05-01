import { useEffect, useState } from "react";
import PSSModel from "./types/PSSModel";
import PSSController from "./types/PSSController";
import MainView from "./views/MainView";

function App() {
  const [pssController, setPSSController] = useState<PSSController | null>(null);

  useEffect(() => {
    const pssModel = new PSSModel("example@example.com");
    const controller = new PSSController(pssModel);
    controller.addTask("Task 1", "Recurring", 10.5, 20220427, 1.5);
    const task = controller.viewTask("Task 1");
    console.log(task);
    setPSSController(controller);
  }, []);

  return <div className='App'>{pssController && <MainView controller={pssController} />}</div>;
}

export default App;
