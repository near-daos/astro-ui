import React from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
  width: 'small' | 'medium' | 'large' | 'block';
  disabled: boolean | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  width = 'medium',
  disabled = false,
  className: classNameProp,
  ...props
}) => {
  const variants = {
    primary: styles.primary,
    secondary: styles.secondary
  };
  const sizes = {
    small: styles['size-small'],
    medium: styles['size-medium'],
    large: styles['size-large'],
    block: styles['size-block']
  };
  const className = classNames(
    styles.btn,
    variants[variant],
    sizes[width],
    classNameProp
  );

  return (
    <button type="button" disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
};
