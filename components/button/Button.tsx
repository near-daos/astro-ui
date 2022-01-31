import React from 'react';
import { UrlObject } from 'url';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'black' | 'transparent';
  size?: 'small' | 'medium' | 'large' | 'block';
  disabled?: boolean | undefined;
  href?: string | UrlObject;
  capitalize?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  capitalize,
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
  };

  const sizes = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
    block: styles.sizeBlock,
  };

  const className = classNames(
    styles.btn,
    variants[variant],
    sizes[size],
    classNameProp,
    {
      [styles.capitalize]: capitalize,
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
