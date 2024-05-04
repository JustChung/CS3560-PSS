import { useCallback, useState } from "react";

export const useRadioGroupState = (
  defaultState: string
): [string, (_ev: React.SyntheticEvent | null, newState: string) => void] => {
  const [state, setState] = useState<string>(defaultState);

  const stateChanged = useCallback((_ev: React.SyntheticEvent | null, newState: string) => {
    setState(newState ?? defaultState);
  }, []);

  return [state, stateChanged];
};
