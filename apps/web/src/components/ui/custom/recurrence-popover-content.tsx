import {
  Calendar as CalendarIcon,
  CircleSlash,
  Check,
  Sunrise,
  CalendarDays,
  Briefcase,
  Coffee,
} from 'lucide-react';
import { PopoverContent } from '#/components/ui/popover';
import { Button } from '#/components/ui/button';
import { ControllerRenderProps } from 'react-hook-form';
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group';
import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldType = Omit<ControllerRenderProps<any, 'recurrence'>, 'value'> & {
  value: string | null | undefined;
};

interface RecurrencePopoverContentProps {
  field: FieldType;
  close: () => void;
  onWeeklyDaysChange?: (days: string | null) => void;
  weeklyDays?: number[] | null;
}

// Day mapping: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const DAY_MAP = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Reverse day mapping for easy lookup
const REVERSE_DAY_MAP: Record<number, string> = Object.entries(DAY_MAP).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {} as Record<number, string>
);

const RecurrencePopoverContent = ({
  field,
  close,
  onWeeklyDaysChange,
  weeklyDays = [],
}: RecurrencePopoverContentProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    // Convert numeric indices to day names
    if (weeklyDays && weeklyDays.length > 0) {
      return weeklyDays
        .map((dayIndex) => REVERSE_DAY_MAP[dayIndex] || '')
        .filter(Boolean);
    }
    return [];
  });

  // Keep selectedDays in sync with weeklyDays from props
  useEffect(() => {
    if (weeklyDays && weeklyDays.length > 0) {
      const dayNames = weeklyDays
        .map((dayIndex) => REVERSE_DAY_MAP[dayIndex] || '')
        .filter(Boolean);

      if (JSON.stringify(dayNames) !== JSON.stringify(selectedDays)) {
        setSelectedDays(dayNames);
      }
    } else if (
      selectedDays.length > 0 &&
      (!weeklyDays || weeklyDays.length === 0)
    ) {
      setSelectedDays([]);
    }
  }, [weeklyDays, selectedDays]);

  const handleRecurrenceChange = (recurrence: string) => {
    // If days are selected, don't change recurrence
    if (selectedDays.length > 0 && recurrence !== 'none') {
      return;
    }

    field.onChange(recurrence);
    close();
  };

  const handleDaysChange = (values: string[]) => {
    setSelectedDays(values);

    // Convert day names to numeric indices for storage
    const dayIndices = values.map(
      (day) => DAY_MAP[day as keyof typeof DAY_MAP]
    );

    if (onWeeklyDaysChange) {
      // Use comma-separated string instead of JSON
      onWeeklyDaysChange(dayIndices.length > 0 ? dayIndices.join(',') : null);
    }

    // If days are selected, set recurrence to weekly_specific
    if (values.length > 0) {
      field.onChange('weekly_specific');
    } else if (field.value === 'weekly_specific') {
      // If no days selected and recurrence was weekly_specific, reset to none
      field.onChange('none');
    }
  };

  // Determine if the recurrence buttons should be disabled
  const areButtonsDisabled = selectedDays.length > 0;

  return (
    <PopoverContent className='w-auto p-0' side='bottom'>
      <div className='flex flex-col p-1 space-y-1'>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          disabled={areButtonsDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleRecurrenceChange('daily')}
        >
          <Sunrise className='mr-2 h-4 w-4' /> Daily
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          disabled={areButtonsDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleRecurrenceChange('weekly')}
        >
          <CalendarDays className='mr-2 h-4 w-4' /> Weekly
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          disabled={areButtonsDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleRecurrenceChange('workdays')}
        >
          <Briefcase className='mr-2 h-4 w-4' /> Workdays
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          disabled={areButtonsDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleRecurrenceChange('weekends')}
        >
          <Coffee className='mr-2 h-4 w-4' /> Weekends
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          disabled={areButtonsDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleRecurrenceChange('monthly')}
        >
          <CalendarIcon className='mr-2 h-4 w-4' /> Monthly
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleRecurrenceChange('none')}
        >
          <CircleSlash className='mr-2 h-4 w-4' /> None
        </Button>
      </div>
      <div className='p-2 border-b'>
        <div className='flex justify-between items-start text-xs text-muted-foreground mb-2'>
          <p>Select days</p>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='h-6 w-6'
            onClick={() => close()}
          >
            <Check className='h-4 w-4' />
          </Button>
        </div>
        <ToggleGroup
          type='multiple'
          className='flex justify-between'
          value={selectedDays}
          onValueChange={handleDaysChange}
        >
          <ToggleGroupItem value='monday' aria-label='Monday'>
            M
          </ToggleGroupItem>
          <ToggleGroupItem value='tuesday' aria-label='Tuesday'>
            T
          </ToggleGroupItem>
          <ToggleGroupItem value='wednesday' aria-label='Wednesday'>
            W
          </ToggleGroupItem>
          <ToggleGroupItem value='thursday' aria-label='Thursday'>
            Th
          </ToggleGroupItem>
          <ToggleGroupItem value='friday' aria-label='Friday'>
            F
          </ToggleGroupItem>
          <ToggleGroupItem value='saturday' aria-label='Saturday'>
            Sa
          </ToggleGroupItem>
          <ToggleGroupItem value='sunday' aria-label='Sunday'>
            Su
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </PopoverContent>
  );
};

export default RecurrencePopoverContent;
