import React from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'black';
  size?: 'small' | 'medium' | 'large' | 'block';
  disabled?: boolean | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className: classNameProp,
  ...props
}) => {
  const variants = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
    black: styles.black
  };
  const sizes = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
    block: styles.sizeBlock
  };
  const className = classNames(
    styles.btn,
    variants[variant],
    sizes[size],
    classNameProp
  );

  return (
    <button type="button" disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
};
