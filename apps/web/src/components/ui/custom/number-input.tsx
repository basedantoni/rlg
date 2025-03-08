import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldType = Omit<ControllerRenderProps<any, 'penaltyAmount'>, 'value'> & {
  value: number | null | undefined;
};

export const NumberInput = ({ field }: { field: FieldType }) => {
  const increment = () => {
    const currentValue = field.value ?? 0;
    const newValue = Math.min(100, currentValue + 1);
    field.onChange(newValue);
  };

  const decrement = () => {
    const currentValue = field.value ?? 0;
    const newValue = Math.max(1, currentValue - 1);
    field.onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      field.onChange(null);
      return;
    }

    const parsed = Number.parseInt(value, 10);
    if (!isNaN(parsed)) {
      field.onChange(parsed);
    }
  };

  // Convert to string for display, use empty string when null
  const displayValue =
    field.value === null || field.value === undefined
      ? ''
      : String(field.value);

  return (
    <div className='relative'>
      <Input
        id={field.name}
        type='text'
        inputMode='numeric'
        pattern='[0-9]*'
        value={displayValue}
        onChange={handleInputChange}
        className='pr-16'
      />
      <div className='absolute inset-y-0 right-0 flex items-center pr-1.5'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={decrement}
          aria-label='Decrease quantity'
        >
          <Minus className='h-3 w-3' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={increment}
          aria-label='Increase quantity'
        >
          <Plus className='h-3 w-3' />
        </Button>
      </div>
    </div>
  );
};
