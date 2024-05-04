import { useCallback, useState } from "react";

export const useRadioGroupState = <T extends string>(
  defaultState: T
): [T, (_ev: React.SyntheticEvent | null, newState: string) => void] => {
  const [state, setState] = useState<T>(defaultState);

  const stateChanged = useCallback((_ev: React.SyntheticEvent | null, newState: string) => {
    setState(newState as T);
  }, []);

  return [state, stateChanged];
};
