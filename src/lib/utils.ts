import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  isPast,
  isFuture,
  isYesterday,
  isToday,
  isTomorrow,
  format,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDueDate = (date: string | number | Date): string => {
  if (isYesterday(date)) {
    return "yesterday";
  } else if (isToday(date)) {
    return "today";
  } else if (isTomorrow(date)) {
    return "tomorrow";
  } else {
    return format(date, "MMM d");
  }
};

export const getDueDateColor = (date: string | null) => {
  if (!date) return null;

  if (isPast(date)) {
    return "text-yesterday";
  } else if (isToday(date)) {
    return "text-today";
  } else if (isTomorrow(date)) {
    return "text-tomorrow";
  } else if (isFuture(date)) {
    return "text-future";
  }
};
