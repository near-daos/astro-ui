import React from 'react';
import { UrlObject } from 'url';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'black'
    | 'transparent'
    | 'green';
  size?: 'small' | 'medium' | 'large' | 'block' | 'flex';
  disabled?: boolean | undefined;
  href?: string | UrlObject;
  capitalize?: boolean;
  noTextTransform?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  capitalize,
  noTextTransform,
  className: classNameProp,
  ...props
}) => {
  const router = useRouter();

  const variants = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
    black: styles.black,
    transparent: styles.transparent,
    green: styles.green,
  };

  const sizes = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
    block: styles.sizeBlock,
    flex: styles.sizeFlex,
  };

  const className = classNames(
    styles.btn,
    variants[variant],
    sizes[size],
    classNameProp,
    {
      [styles.capitalize]: capitalize,
      [styles.noTextTransform]: noTextTransform,
      [styles.disabled]: disabled,
    }
  );

  function onClick() {
    if (href) {
      router.push(href);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
