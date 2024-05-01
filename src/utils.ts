export function dayOfTheWeek(date: number): number {
  const day = date % 100;
  const month = Math.round(date / 100) % 100;
  const year = Math.round(date / 10000);

  return new Date(year, month - 1, day).getDay();
}

export function getMonth(date: number): number {
  return Math.round(date / 100) % 100;
}
