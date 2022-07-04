import React from 'react';
import cn from 'classnames';

import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';

import styles from './ControlledInput.module.scss';

interface Props {
  symbol?: string;
  maxValue: number;
  onMaxPress: (max: number) => void;
  inputClassName?: string;
}

export const ControlledInput = React.forwardRef<HTMLInputElement, Props>(
  ({ symbol, inputClassName, maxValue, onMaxPress, ...rest }, ref) => {
    return (
      <div className={styles.root}>
        <Input
          {...rest}
          size="block"
          type="number"
          min={0}
          max={maxValue}
          ref={ref}
          isBorderless
          className={styles.inputWrapper}
          inputClassName={cn(styles.input, inputClassName)}
        />
        {symbol && <span className={styles.symbol}>{symbol}</span>}
        <Button
          variant="transparent"
          className={styles.maxButton}
          size="small"
          onClick={() => onMaxPress(maxValue)}
        >
          MAX
        </Button>
      </div>
    );
  }
);
