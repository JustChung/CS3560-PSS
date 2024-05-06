import { useState } from "react";

// This violates React principles, but since we're mixing oop into react we need something to start rerenders
export const useForceRerender = () => {
  const [state, setState] = useState(1);
  const rerender = () => setState(state + 1);
  return rerender;
};
