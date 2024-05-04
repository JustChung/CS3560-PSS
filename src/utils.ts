export function dayOfTheWeek(date: number): number {
  const day = date % 100;
  const month = Math.floor(date / 100) % 100;
  const year = Math.floor(date / 10000);

  return new Date(year, month - 1, day).getDay();
}

export function getDayOfMonth(date: number): number {
  return date % 100;
}

export function calcEndTime(startTime: number, duration: number) {
  const hours = Math.floor(duration);
  const minutes = (duration % 1) * 100;

  let newHours = Math.floor(startTime / 100) + hours;
  let newMinutes = (startTime % 100) + minutes;

  // carry the 1 from minutes
  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
  }

  return newHours * 100 + newMinutes;
}
