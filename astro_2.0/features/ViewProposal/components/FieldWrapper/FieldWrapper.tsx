import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './FieldWrapper.module.scss';

interface InputWrapperProps {
  label: string;
  fullWidth?: boolean;
  alignRight?: boolean;
  flex?: boolean;
}

export const FieldWrapper: FC<InputWrapperProps> = ({
  children,
  label,
  fullWidth = false,
  flex,
  alignRight,
}) => {
  return (
    <div
      className={cn(styles.root, {
        [styles.fullWidth]: fullWidth,
        [styles.flex]: flex,
        [styles.alignRight]: alignRight,
      })}
    >
      <div className={cn(styles.label)}>
        <span>{label}&nbsp;</span>
      </div>
      {children}
    </div>
  );
};

interface FieldValueProps {
  value: string | number | ReactNode;
}

export const FieldValue: FC<FieldValueProps> = ({ value }) => {
  return <div className={styles.value}>{value}</div>;
};
