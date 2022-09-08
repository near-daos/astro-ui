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
  hidden?: boolean;
}

export const FieldWrapper: FC<InputWrapperProps> = ({
  children,
  label,
  fullWidth = false,
  flex,
  alignRight,
  labelClassName,
  className,
  hidden,
}) => {
  return (
    <div
      className={cn(
        styles.root,
        {
          [styles.fullWidth]: fullWidth,
          [styles.flex]: flex,
          [styles.alignRight]: alignRight,
          [styles.hidden]: hidden,
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
  autoHeight?: boolean;
}

export const FieldValue: FC<FieldValueProps> = ({
  value,
  normal,
  noWrap,
  className,
  autoHeight,
}) => {
  return (
    <div
      className={cn(
        styles.value,
        {
          [styles.normal]: normal,
          [styles.noWrap]: noWrap,
          [styles.autoHeight]: autoHeight,
        },
        className
      )}
    >
      {noWrap ? (
        <div
          className={styles.ellipse}
          data-tip={value}
          data-place="top"
          data-delay-show="700"
        >
          {value}
        </div>
      ) : (
        value
      )}
    </div>
  );
};
