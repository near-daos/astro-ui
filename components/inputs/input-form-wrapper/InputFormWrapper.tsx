import cn from 'classnames';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';

import styles from './InputFormWrapper.module.scss';

interface InputFormWrapperProps {
  component: JSX.Element;
  className?: string;
  errors: Record<string, FieldError>;
}

export const InputFormWrapper: FC<InputFormWrapperProps> = ({
  errors,
  className,
  component
}) => {
  function getError() {
    const name = component?.props?.name;
    const error = errors[name];

    return error;
  }

  function renderError() {
    const error = getError();

    if (error) {
      const { message } = error;

      return <div className={styles.error}>{message}</div>;
    }

    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      {component}
      {renderError()}
    </div>
  );
};
