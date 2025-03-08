'use client';

import { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { capitalize } from '@/lib/utils';

import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import RecurrencePopoverContent from '@/components/ui/custom/recurrence-popover-content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldType = Omit<ControllerRenderProps<any, 'recurrence'>, 'value'> & {
  value: string | null | undefined;
};

interface RecurrencePopoverProps {
  field: FieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weeklyDaysField?: ControllerRenderProps<any, 'weeklyDays'>;
}

// Helper to get day abbreviation
const getDayAbbr = (dayIndex: number): string => {
  const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
  return days[dayIndex] || '';
};

const RecurrencePopover = ({
  field,
  weeklyDaysField,
}: RecurrencePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Parse weeklyDays from the field value
  const getWeeklyDays = (): number[] | null => {
    if (!weeklyDaysField?.value) return null;

    try {
      // Parse comma-separated string
      if (
        typeof weeklyDaysField.value === 'string' &&
        weeklyDaysField.value.length > 0
      ) {
        return weeklyDaysField.value.split(',').map(Number);
      }
      return null;
    } catch (e) {
      console.error('Error parsing weeklyDays:', e);
      return null;
    }
  };

  // Update the weeklyDays field with comma-separated string
  const handleWeeklyDaysChange = (daysString: string | null) => {
    if (weeklyDaysField) {
      weeklyDaysField.onChange(daysString);
    }
  };

  // Get days display text for weekly_specific
  const getWeeklyDaysText = (): string => {
    const days = getWeeklyDays();
    if (!days || days.length === 0) return 'Custom';

    // Sort days to display in sequence
    const sortedDays = [...days].sort((a, b) => a - b);
    return sortedDays.map((day) => getDayAbbr(day)).join(', ');
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        {field.value !== 'none' ? (
          <Badge
            className='w-fit h-8 flex gap-2 cursor-pointer hover:bg-accent'
            variant='outline'
          >
            {field.value === 'weekly_specific'
              ? getWeeklyDaysText()
              : capitalize(field.value ?? 'none')}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='badge'
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange('none');
                      if (weeklyDaysField) {
                        weeklyDaysField.onChange(null);
                      }
                    }}
                  >
                    <X size={16} strokeWidth={1} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear Recurrence</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Badge>
        ) : (
          <Button
            variant='outline'
            size='icon'
            className={cn(
              'h-8 w-8',
              field.value === 'none' && 'text-muted-foreground'
            )}
          >
            <RefreshCw size={14} />
          </Button>
        )}
      </PopoverTrigger>
      <RecurrencePopoverContent
        field={field}
        close={() => setPopoverOpen(false)}
        weeklyDays={getWeeklyDays()}
        onWeeklyDaysChange={handleWeeklyDaysChange}
      />
    </Popover>
  );
};

export default RecurrencePopover;
