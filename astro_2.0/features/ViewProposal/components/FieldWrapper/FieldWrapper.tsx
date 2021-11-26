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
  normal?: boolean;
  noWrap?: boolean;
}

export const FieldValue: FC<FieldValueProps> = ({ value, normal, noWrap }) => {
  return (
    <div
      className={cn(styles.value, {
        [styles.normal]: normal,
        [styles.noWrap]: noWrap,
      })}
    >
      {value}
    </div>
  );
};
