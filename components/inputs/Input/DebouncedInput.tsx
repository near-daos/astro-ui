import React from 'react';
import { InputProps } from 'components/inputs/Input/types';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

import { Input } from './Input';

interface Props extends InputProps {
  onValueChange: (
    value: string | number | readonly string[] | undefined
  ) => void;
}

export const DebouncedInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onValueChange, defaultValue = '', ...rest }, ref) => {
    const [val, setVal] = React.useState(defaultValue ?? '');

    useDebounceEffect(
      ({ isInitialCall }) => {
        if (isInitialCall) {
          return;
        }

        if (val !== defaultValue || val === '') {
          onValueChange(val);
        }
      },
      700,
      [val]
    );

    return (
      <Input
        {...rest}
        ref={ref}
        defaultValue={defaultValue}
        onChange={({ currentTarget }) => {
          setVal(currentTarget.value);
        }}
      />
    );
  }
);
