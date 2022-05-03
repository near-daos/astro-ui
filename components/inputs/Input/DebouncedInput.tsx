import React from 'react';
import { useDebounce } from 'react-use';
import { InputProps } from 'components/inputs/Input/types';
import { Input } from './Input';

interface Props extends InputProps {
  onValueChange: (
    value: string | number | readonly string[] | undefined
  ) => void;
}

export const DebouncedInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onValueChange, defaultValue, ...rest }, ref) => {
    const [val, setVal] = React.useState(defaultValue ?? '');

    useDebounce(
      () => {
        onValueChange(val);
      },
      700,
      [val]
    );

    return (
      <Input
        {...rest}
        ref={ref}
        onChange={({ currentTarget }) => {
          setVal(currentTarget.value);
        }}
      />
    );
  }
);
