import {
  CalendarFold,
  Sunrise,
  Armchair,
  CalendarClock,
  CircleSlash,
} from 'lucide-react';

import { PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';

import { ControllerRenderProps } from 'react-hook-form';
import {
  addWeeks,
  addDays,
  nextSaturday,
  isBefore,
  startOfDay,
} from 'date-fns';

type FieldType = Omit<ControllerRenderProps<any, 'dueDate'>, 'value'> & {
  value: Date | string | null | undefined;
};

interface DueDatePopoverContentProps {
  field: FieldType;
  close: () => void;
}

const DueDatePopoverContent = ({
  field,
  close,
}: DueDatePopoverContentProps) => {
  const handleQuickAction = (action: string) => {
    let newDate: Date | null = null;
    switch (action) {
      case 'tomorrow':
        newDate = addDays(new Date(), 1);
        break;
      case 'nextWeek':
        newDate = addWeeks(new Date(), 1);
        break;
      case 'nextWeekend':
        newDate = nextSaturday(new Date());
        break;
      case 'postpone':
        newDate = addDays(new Date(), 7);
        break;
      case 'noDate':
        newDate = null;
        break;
    }

    field.onChange(newDate ? newDate.toISOString() : null);
    close();
  };

  return (
    <PopoverContent className='w-auto p-0' side='right'>
      <div className='flex flex-col p-1 space-y-1'>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            handleQuickAction('tomorrow');
          }}
        >
          <Sunrise className='mr-2 h-4 w-4' /> Tomorrow
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            handleQuickAction('nextWeek');
          }}
        >
          <CalendarFold className='mr-2 h-4 w-4' /> Next Week
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            handleQuickAction('nextWeekend');
          }}
        >
          <Armchair className='mr-2 h-4 w-4' /> Next Weekend
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            handleQuickAction('postpone');
          }}
        >
          <CalendarClock className='mr-2 h-4 w-4' /> Postpone
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='justify-start'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            handleQuickAction('noDate');
          }}
        >
          <CircleSlash className='mr-2 h-4 w-4' /> No Date
        </Button>
      </div>
      <Separator />
      <Calendar
        mode='single'
        selected={field.value ? new Date(field.value) : undefined}
        onSelect={(date) => {
          field.onChange(date?.toISOString() ?? null);
          close();
        }}
        disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
        initialFocus
      />
    </PopoverContent>
  );
};

export default DueDatePopoverContent;
