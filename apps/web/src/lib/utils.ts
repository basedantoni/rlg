import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
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
  getDay,
} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDueDate = (date: string): string => {
  const parsedDate = parseISO(date);

  if (isYesterday(parsedDate)) {
    return 'yesterday';
  } else if (isToday(parsedDate)) {
    return 'today';
  } else if (isTomorrow(parsedDate)) {
    return 'tomorrow';
  } else {
    return format(parsedDate, 'MMM d');
  }
};

export const getDueDateColor = (date: string) => {
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return 'text-today';
  } else if (isPast(parsedDate)) {
    return 'text-yesterday';
  } else if (isTomorrow(parsedDate)) {
    return 'text-tomorrow';
  } else if (isFuture(parsedDate)) {
    return 'text-future';
  }
};

export const calculateNextDueDate = (
  currentDate: string,
  recurrence: string,
  weeklyDays?: string | number[] | null
): string | null => {
  const date = parseISO(currentDate);

  console.log('weeklyDays', weeklyDays);
  switch (recurrence) {
    case 'daily':
      return addDays(date, 1).toISOString();
    case 'workdays':
      return [0, 5, 6].includes(date.getDay())
        ? nextMonday(date).toISOString()
        : addDays(date, 1).toISOString();
    case 'weekends':
      return [1, 2, 3, 4, 5].includes(date.getDay())
        ? nextSaturday(date).toISOString()
        : addDays(date, 1).toISOString();
    case 'weekly':
      return addDays(date, 7).toISOString();
    case 'weekly_specific': {
      if (!weeklyDays) {
        return addDays(date, 7).toISOString(); // Default to weekly if no days specified
      }

      // Parse weeklyDays if it's a string
      let dayIndices: number[];
      if (typeof weeklyDays === 'string') {
        dayIndices = weeklyDays.split(',').map(Number);
      } else {
        dayIndices = weeklyDays as number[];
      }

      if (dayIndices.length === 0) {
        return addDays(date, 7).toISOString(); // Default to weekly if no days specified
      }

      // Sort weeklyDays to ensure we find the next occurrence correctly
      const sortedDays = [...dayIndices].sort((a, b) => a - b);
      const currentDay = getDay(date);

      // Find the next day of the week
      const nextDay = sortedDays.find((day) => day > currentDay);

      if (nextDay !== undefined) {
        // Found a day later in the current week
        return addDays(date, nextDay - currentDay).toISOString();
      } else {
        // Wrap around to the first day in the next week
        // Handle case where sortedDays[0] is undefined
        if (sortedDays.length === 0) {
          return addDays(date, 7).toISOString(); // Default to weekly if no valid days
        }
        // Ensure sortedDays[0] exists before using it
        return addDays(
          date,
          7 - currentDay + (sortedDays[0] ?? 0)
        ).toISOString();
      }
    }
    case 'monthly':
      return new Date(date.setMonth(date.getMonth() + 1)).toISOString();
    default:
      return null;
  }
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
