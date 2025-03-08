'use client';

import * as React from 'react';
import { TimePicker } from '#components/ui/custom/time-picker';
import { ControllerRenderProps } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldType = Omit<ControllerRenderProps<any, 'cutoffTime'>, 'value'> & {
  value: string | null | undefined;
};

interface FormTimePickerProps {
  field: FieldType;
  className?: string;
  disabled?: boolean;
}

const FormTimePicker = ({
  field,
  className,
  disabled,
}: FormTimePickerProps) => {
  const handleTimeChange = (time: string) => {
    field.onChange(time);
  };

  return (
    <TimePicker
      value={field.value ?? new Date().toISOString()}
      onChange={handleTimeChange}
      className={className}
      disabled={disabled}
    />
  );
};

export { FormTimePicker };
