import cn from 'classnames';
import get from 'lodash/get';
import { createPortal } from 'react-dom';
import { FieldError } from 'react-hook-form';
import React, { RefObject, PropsWithRef } from 'react';

import styles from './InputFormWrapper.module.scss';

interface InputFormWrapperProps<T extends Element> {
  component: JSX.Element;
  className?: string;
  errorClassName?: string;
  errors: Record<string, FieldError>;
  errorElRef?: RefObject<T>;
}

export const InputFormWrapper = <T extends Element>(
  props: PropsWithRef<InputFormWrapperProps<T>>
): JSX.Element => {
  const { errors, className, component, errorElRef, errorClassName } = props;

  function getError() {
    const name = component?.props?.name;
    const error = get(errors, name);

    return error;
  }

  function renderError() {
    const error = getError();

    if (error) {
      const { message } = error;
      const el = (
        <div className={cn(styles.error, errorClassName)}>{message}</div>
      );

      return errorElRef?.current ? createPortal(el, errorElRef.current) : el;
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
