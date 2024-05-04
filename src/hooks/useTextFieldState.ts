import { ChangeEventHandler, useCallback, useState } from "react";
export const useTextFieldState = (
  defaultState: string
): [string, ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>] => {
  const [state, setState] = useState<string>(defaultState);

  const stateChanged: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((ev) => {
    setState(ev.target.value);
  }, []);

  return [state, stateChanged];
};
