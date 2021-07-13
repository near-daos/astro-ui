import React from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
  type: 'button' | 'submit' | 'reset' | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className: classNameProp,
  ...props
}) => {
  const variants = {
    primary: styles.primary,
    secondary: styles.secondary
  };
  const className = classNames(styles.btn, variants[variant], classNameProp);

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};
