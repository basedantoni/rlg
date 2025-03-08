'use client';

import { Button } from '#/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '#/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { Label } from '#/components/ui/label';
import { SlidersHorizontal } from 'lucide-react';

import { useState } from 'react';

export type SortDirection = 'asc' | 'desc';
export type SortColumns = 'title' | 'dueDate' | 'createdAt';

interface SelectItemOption {
  placeholder: string;
  value: string;
}

interface SelectItemDirection extends Omit<SelectItemOption, 'value'> {
  value: SortDirection;
}

interface DirectionConfig {
  label: string;
  options: SelectItemDirection[];
}

interface SortingConfig {
  label: string;
  options: SelectItemOption[];
}

interface ViewOptionsPopoverProps {
  onSortChange: (sort: SortColumns, direction: SortDirection) => void;
}

const ViewOptionsPopover = ({ onSortChange }: ViewOptionsPopoverProps) => {
  const sortingConfig: SortingConfig = {
    label: 'Sorting',
    options: [
      { placeholder: 'Name', value: 'title' },
      { placeholder: 'Date', value: 'dueDate' },
      { placeholder: 'Date Added', value: 'createdAt' },
    ],
  };

  const directionConfig: DirectionConfig = {
    label: 'Direction',
    options: [
      { placeholder: 'Ascending', value: 'asc' },
      { placeholder: 'Descending', value: 'desc' },
    ],
  };

  const [sort, setSort] = useState<SortColumns>('dueDate');
  const [direction, setDirection] = useState<SortDirection>('asc');

  const handleSortChange = (value: SortColumns) => {
    setSort(value);
    onSortChange(value, direction);
  };

  const handleDirectionChange = (value: SortDirection) => {
    setDirection(value);
    onSortChange(sort, value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon'>
          <SlidersHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='flex flex-col space-y-1.5 w-80 text-sm'>
        <Label>Sort</Label>
        <Select onValueChange={(value: SortColumns) => handleSortChange(value)}>
          <SelectGroup className='flex justify-between items-center'>
            <SelectLabel className='p-0 font-normal'>
              {sortingConfig.label}
            </SelectLabel>
            <SelectTrigger className='w-40'>
              <SelectValue
                placeholder={
                  sortingConfig.options.find((option) => option.value === sort)
                    ?.placeholder
                }
              />
            </SelectTrigger>
          </SelectGroup>
          <SelectContent>
            {sortingConfig.options.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.placeholder}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: SortDirection) => handleDirectionChange(value)}
        >
          <SelectGroup className='flex justify-between items-center'>
            <SelectLabel className='p-0 font-normal'>
              {directionConfig.label}
            </SelectLabel>
            <SelectTrigger className='w-40'>
              <SelectValue
                placeholder={
                  directionConfig.options.find(
                    (option) => option.value === direction
                  )?.placeholder
                }
              />
            </SelectTrigger>
          </SelectGroup>
          <SelectContent>
            {directionConfig.options.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.placeholder}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

export default ViewOptionsPopover;
