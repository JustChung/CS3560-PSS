import { useEffect, useState } from "react";
import PSSModel from "./classes/PSSModel.ts";
import PSSController from "./classes/PSSController";
import MainView from "./views/MainView";

function App() {
  const [pssController, setPSSController] = useState<PSSController | null>(null);

  useEffect(() => {
    const pssModel = new PSSModel("temp@email.com");
    const controller = new PSSController(pssModel);
    pssModel.setController(controller);
    setPSSController(controller);
  }, []);

  return <div className='App'>{pssController && <MainView controller={pssController} />}</div>;
}

export default App;
