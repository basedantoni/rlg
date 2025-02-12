import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  isPast,
  isFuture,
  isYesterday,
  isToday,
  isTomorrow,
  format,
  parseISO,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDueDate = (date: string): string => {
  const parsedDate = parseISO(date);

  if (isYesterday(parsedDate)) {
    return "yesterday";
  } else if (isToday(parsedDate)) {
    return "today";
  } else if (isTomorrow(parsedDate)) {
    return "tomorrow";
  } else {
    return format(parsedDate, "MMM d");
  }
};

export const getDueDateColor = (date: string) => {
  const parsedDate = parseISO(date);
  console.log(date);
  console.log(parsedDate);

  if (isToday(parsedDate)) {
    return "text-today";
  } else if (isPast(parsedDate)) {
    return "text-yesterday";
  } else if (isTomorrow(parsedDate)) {
    return "text-tomorrow";
  } else if (isFuture(parsedDate)) {
    return "text-future";
  }
};
