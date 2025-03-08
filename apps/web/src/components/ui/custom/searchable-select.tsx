'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';

interface SearchableSelectProps<T> {
  items: T[];
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  filterItems: (items: T[], searchTerm: string) => T[];
  onCreateItem?: (searchTerm: string) => void;
  createButtonLabel?: (searchTerm: string) => string;
  triggerClassName?: string;
}

const SearchableSelect = <T,>({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  getItemId,
  getItemLabel,
  filterItems,
  onCreateItem,
  createButtonLabel = (term) => `Create "${term}"`,
  triggerClassName,
}: SearchableSelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredItems(filterItems(items, searchTerm));
  }, [searchTerm, items, filterItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Select
      value={value ?? undefined}
      onValueChange={onValueChange}
      onOpenChange={(open) => {
        if (open) {
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 0);
        } else {
          setSearchTerm(''); // Reset search when closing
        }
      }}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <Input
          ref={searchInputRef}
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={(e) => e.stopPropagation()}
          className='mb-2'
        />
        {filteredItems.length === 0 && searchTerm && onCreateItem && (
          <Button
            variant='ghost'
            size='sm'
            className='w-full justify-start'
            onClick={() => onCreateItem(searchTerm)}
          >
            <Plus size={16} className='mr-2' />
            {createButtonLabel(searchTerm)}
          </Button>
        )}
        {filteredItems.map((item) => (
          <SelectItem key={getItemId(item)} value={getItemId(item)}>
            {getItemLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { SearchableSelect };
