import React, { FC, ReactElement, useState } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Icon } from 'components/Icon';
import { Popup } from 'components/Popup';

import styles from './InputWrapper.module.scss';

interface InputWrapperProps {
  fieldName: string;
  label: string | ReactElement;
  fullWidth?: boolean;
  alignRight?: boolean;
  flex?: boolean;
  className?: string;
  labelClassName?: string;
  hidden?: boolean;
}

export const InputWrapper: FC<InputWrapperProps> = ({
  children,
  fieldName,
  label,
  fullWidth = false,
  flex,
  alignRight,
  className = '',
  labelClassName = '',
  hidden,
}) => {
  const {
    formState: { errors },
  } = useFormContext();
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const error = errors[fieldName];

  return (
    <div
      className={cn(styles.root, className, {
        [styles.fullWidth]: fullWidth,
        [styles.flex]: flex,
        [styles.alignRight]: alignRight,
        [styles.hidden]: hidden,
      })}
    >
      <div
        className={cn(styles.label, labelClassName, {
          [styles.error]: !!error,
        })}
      >
        <span>{label}</span>
        {error && (
          <>
            <div ref={setRef} className="">
              <Icon name="info" width={12} className={styles.icon} />
            </div>
            <Popup anchor={ref} offset={[0, 10]} placement="auto">
              <span className={styles.error}>{error.message}</span>
            </Popup>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
