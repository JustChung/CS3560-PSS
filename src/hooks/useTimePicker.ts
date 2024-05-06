import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";

const roundTime = (time: Dayjs): Dayjs => {
  const minutes = Math.round(time.minute() / 15) * 15;
  return time.minute(minutes);
};

export const useTimePicker = (defaultState: Dayjs): [Dayjs, (time: Dayjs | null) => void] => {
  const [state, setState] = useState<Dayjs>(roundTime(defaultState));

  const stateChanged = useCallback((time: Dayjs | null) => {
    setState(roundTime(time ?? dayjs()));
  }, []);

  return [state, stateChanged];
};
