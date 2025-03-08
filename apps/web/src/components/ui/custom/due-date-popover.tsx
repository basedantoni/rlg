'use client';

import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';
import { cn, formatDueDate } from '@/lib/utils';

import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DueDatePopoverContent from '@/components/ui/custom/due-date-popover-content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldType = Omit<ControllerRenderProps<any, 'dueDate'>, 'value'> & {
  value: Date | string | null | undefined;
};

interface DueDatePopoverProps {
  field: FieldType;
}

const DueDatePopover = ({ field }: DueDatePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        {field.value ? (
          <Badge
            className='w-fit h-8 flex gap-2 cursor-pointer hover:bg-accent'
            variant='outline'
          >
            <p className='capitalize'>
              {formatDueDate(new Date(field.value).toISOString())}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='badge'
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(null);
                    }}
                  >
                    <X size={16} strokeWidth={1} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear Date</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Badge>
        ) : (
          <Button
            variant='outline'
            size='icon'
            className={cn(!field.value && 'text-muted-foreground')}
          >
            <CalendarIcon size={10} />
          </Button>
        )}
      </PopoverTrigger>
      <DueDatePopoverContent
        field={field}
        close={() => setPopoverOpen(false)}
      />
    </Popover>
  );
};

export default DueDatePopover;
