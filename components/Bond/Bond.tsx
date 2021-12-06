import React from 'react';
import cn from 'classnames';
import { Token } from 'features/types';
import styles from './Bond.module.scss';

export interface BondProps {
  value: number | string;
  token: Token;
  className?: string;
}

export const Bond: React.FC<BondProps> = ({ value, token, className }) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.subtitle}>Bond</div>
      <div className={styles.valueWrapper}>
        <div className={styles.value}>{value}</div>
        <div className={cn(styles.token, styles.ml8)}>{token}</div>
      </div>
      <div className={styles.text}>
        To prevent spam, you must pay a bond. The bond will be returned to you
        when the proposal is approved or rejected. The bond will not be returned
        if your proposal is marked as spam or expires.
      </div>
    </div>
  );
};
