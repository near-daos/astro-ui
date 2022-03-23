import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './FieldWrapper.module.scss';

interface InputWrapperProps {
  label: string;
  fullWidth?: boolean;
  alignRight?: boolean;
  flex?: boolean;
  labelClassName?: string;
  className?: string;
}

export const FieldWrapper: FC<InputWrapperProps> = ({
  children,
  label,
  fullWidth = false,
  flex,
  alignRight,
  labelClassName,
  className,
}) => {
  return (
    <div
      className={cn(
        styles.root,
        {
          [styles.fullWidth]: fullWidth,
          [styles.flex]: flex,
          [styles.alignRight]: alignRight,
        },
        className
      )}
    >
      <div className={cn(styles.label, labelClassName)}>
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
  className?: string;
}

export const FieldValue: FC<FieldValueProps> = ({
  value,
  normal,
  noWrap,
  className,
}) => {
  return (
    <div
      className={cn(
        styles.value,
        {
          [styles.normal]: normal,
          [styles.noWrap]: noWrap,
        },
        className
      )}
    >
      {value}
    </div>
  );
};
