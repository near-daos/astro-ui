import React from 'react';
import { useDebounce } from 'react-use';
import { InputProps } from 'components/inputs/Input/types';
import { Input } from './Input';

interface Props extends InputProps {
  onValueChange: (value: string) => void;
}

export const DebouncedInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onValueChange, ...rest }, ref) => {
    const [val, setVal] = React.useState('');

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
