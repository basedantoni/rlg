import * as React from 'react';

import { cn } from '#/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'text-foreground flex w-full rounded-md bg-transparent px-3 py-1 transition-colors placeholder:text-muted-foreground md:text-sm',
  {
    variants: {
      variant: {
        default:
          'h-9 text-base border border-input shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
        ghost: 'px-0 focus-visible:outline-hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
