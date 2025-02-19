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
  addDays,
  nextMonday,
  nextSaturday,
  nextSunday,
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

export const calculateNextDueDate = (
  currentDate: string,
  recurrence: string,
): string | null => {
  const date = parseISO(currentDate);

  switch (recurrence) {
    case "daily":
      return addDays(date, 1).toISOString();
    case "workdays":
      return [0, 5, 6].includes(date.getDay())
        ? nextMonday(date).toISOString()
        : addDays(date, 1).toISOString();
    case "weekends":
      return [1, 2, 3, 4, 5].includes(date.getDay())
        ? nextSaturday(date).toISOString()
        : addDays(date, 1).toISOString();
    case "weekly":
      return addDays(date, 7).toISOString();
    case "monthly":
      return new Date(date.setMonth(date.getMonth() + 1)).toISOString();
    default:
      return null;
  }
};

export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
