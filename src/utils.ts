import { Frequency } from "./classes/RecurringTask";

export function dayOfTheWeek(date: number): number {
  const day = date % 100;
  const month = Math.floor(date / 100) % 100;
  const year = Math.floor(date / 10000);

  return new Date(year, month - 1, day).getDay();
}

export function getDayOfMonth(date: number): number {
  return date % 100;
}

export function getDate(date: number): string {
  const day = date % 100;
  const month = Math.floor(date / 100) % 100;
  const year = Math.floor(date / 10000);

  return new Date(year, month - 1, day).toLocaleDateString();
}

export function getTime(time: number): string {
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;

  return new Date(0, 0, 0, hours, minutes)
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    .replace(" ", "");
}

export function getDateTime(date: number, time: number): string {
  const day = date % 100;
  const month = Math.floor(date / 100) % 100;
  const year = Math.floor(date / 10000);

  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;

  return new Date(year, month - 1, day, hours, minutes).toLocaleString();
}

export function getDigit(num: number, digitPlace: number) {
  return Math.floor((num / 10 ** (Math.floor(digitPlace) - 1)) % 10);
}
export function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export function numberToFrequency(val: number): Frequency {
  switch (val) {
    case 1:
      return Frequency.Daily;
    case 7:
      return Frequency.Weekly;
    case 30:
    case 31:
      return Frequency.Monthly;
    default:
      throw new Error(`${val} is not a valid frequency.`);
  }
}
