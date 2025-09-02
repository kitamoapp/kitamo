
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Basic formatting: remove non-digit characters
      const formatted = e.target.value.replace(/\D/g, '');
      
      // Enforce a max length if needed, e.g., 15 digits
      if (formatted.length > 15) return;
      
      // Prepend '+' if it's not there
      onChange('+' + formatted);
    };

    return (
      <Input
        type="tel"
        className={cn(className)}
        value={value}
        onChange={handleInputChange}
        placeholder="+1 (555) 123-4567"
        ref={ref}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
