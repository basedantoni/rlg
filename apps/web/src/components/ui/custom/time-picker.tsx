'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { Input } from '#/components/ui/input';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
  disabled?: boolean;
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ value, onChange, className, disabled }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [hours, setHours] = React.useState('12');
    const [minutes, setMinutes] = React.useState('00');
    const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');

    // Parse time from ISO string or HH:MM format
    React.useEffect(() => {
      if (!value) {
        setHours('12');
        setMinutes('00');
        setPeriod('AM');
        return;
      }

      try {
        let timeObj: Date;

        if (value.includes('T')) {
          // ISO string format
          timeObj = new Date(value);
        } else {
          // HH:MM format
          const [h, m] = value.split(':').map(Number);
          timeObj = new Date();
          timeObj.setHours(h ?? 0);
          timeObj.setMinutes(m ?? 0);
        }

        let hours = timeObj.getHours();
        const minutes = timeObj.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;

        setHours(hours.toString().padStart(2, '0'));
        setMinutes(minutes.toString().padStart(2, '0'));
        setPeriod(period);
      } catch (error) {
        console.error('Error parsing time:', error);
      }
    }, [value]);

    // Update the time value when hours, minutes, or period changes
    const handleTimeChange = () => {
      let h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);

      // Convert from 12-hour to 24-hour format
      if (period === 'PM' && h < 12) {
        h += 12;
      } else if (period === 'AM' && h === 12) {
        h = 0;
      }

      // Create a new date with the current date but updated time
      const date = new Date();
      date.setHours(h);
      date.setMinutes(m);
      date.setSeconds(0);
      date.setMilliseconds(0);

      onChange(date.toISOString());
      setOpen(false);
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        setHours('');
      } else if (num > 12) {
        setHours('12');
      } else if (num < 1) {
        setHours('1');
      } else {
        setHours(num.toString());
      }
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        setMinutes('');
      } else if (num > 59) {
        setMinutes('59');
      } else {
        setMinutes(num.toString().padStart(2, '0'));
      }
    };

    const formattedTime = React.useMemo(() => {
      if (!hours || !minutes) return '';
      const h = hours.padStart(2, '0');
      const m = minutes.padStart(2, '0');
      return `${h}:${m} ${period}`;
    }, [hours, minutes, period]);

    return (
      <div ref={ref} className={cn('relative', className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )}
              disabled={disabled}
            >
              <Clock className='mr-2 h-4 w-4' />
              {formattedTime || 'Select time'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-4'>
            <div className='flex items-center justify-between space-x-2'>
              <div className='grid gap-1 text-center'>
                <div className='text-xs font-medium text-muted-foreground'>
                  Hours
                </div>
                <Input
                  type='text'
                  inputMode='numeric'
                  className='w-16 text-center'
                  value={hours}
                  onChange={handleHoursChange}
                  maxLength={2}
                />
              </div>
              <div className='text-xl font-semibold text-muted-foreground'>
                :
              </div>
              <div className='grid gap-1 text-center'>
                <div className='text-xs font-medium text-muted-foreground'>
                  Minutes
                </div>
                <Input
                  type='text'
                  inputMode='numeric'
                  className='w-16 text-center'
                  value={minutes}
                  onChange={handleMinutesChange}
                  maxLength={2}
                />
              </div>
              <div className='grid gap-1 text-center'>
                <div className='text-xs font-medium text-muted-foreground'>
                  Period
                </div>
                <div className='flex'>
                  <Button
                    type='button'
                    variant={period === 'AM' ? 'default' : 'outline'}
                    size='sm'
                    className='rounded-r-none'
                    onClick={() => setPeriod('AM')}
                  >
                    AM
                  </Button>
                  <Button
                    type='button'
                    variant={period === 'PM' ? 'default' : 'outline'}
                    size='sm'
                    className='rounded-l-none'
                    onClick={() => setPeriod('PM')}
                  >
                    PM
                  </Button>
                </div>
              </div>
            </div>
            <div className='mt-4 flex justify-end'>
              <Button type='button' size='sm' onClick={handleTimeChange}>
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export { TimePicker };
