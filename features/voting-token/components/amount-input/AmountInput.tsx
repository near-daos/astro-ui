import React, { FC, FormEvent } from 'react';
import cn from 'classnames';

import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';

import styles from './amount-input.module.scss';

interface AmountInputProps {
  label: string;
  placeholder: string;
  tokenName: string;
  value?: string;
  onChange: (e: FormEvent) => void;
  cost: number;
  onMax: () => void;
}

export const AmountInput: FC<AmountInputProps> = ({
  label,
  placeholder,
  tokenName,
  value,
  onChange,
  cost,
  onMax
}) => {
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <div className={styles.root}>
        <div className={styles.input}>
          <Input
            placeholder={placeholder}
            size="block"
            type="number"
            inputSize={200}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className={styles.right}>
          <span className={styles.type}>{tokenName}</span>
          <Button size="small" className={styles.max} onClick={onMax}>
            Max
          </Button>
        </div>
      </div>
      <div
        className={cn(styles.cost, {
          [styles.active]: cost > 0
        })}
      >
        ≈${cost}
      </div>
    </div>
  );
};
