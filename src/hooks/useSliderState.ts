import { useCallback, useState } from "react";

export const useSliderState = (defaultState: number): [number, (_ev: Event, val: number | number[]) => void] => {
  const [state, setState] = useState<number>(defaultState);

  const stateChanged = useCallback((_ev: Event, val: number | number[]) => {
    if (val instanceof Array) {
      setState(val[0]);
    } else {
      setState(val);
    }
  }, []);

  return [state, stateChanged];
};
