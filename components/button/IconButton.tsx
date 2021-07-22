import React from 'react';
import classNames from 'classnames';
import buttonStyles from './icon-button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
}

export const IconButton: React.FC<ButtonProps> = ({
  className: classNameProp,
  size = 'small',
  children,
  ...props
}) => {
  const sizes = {
    small: buttonStyles.small,
    medium: buttonStyles.medium,
    large: buttonStyles.large
  };
  const className = classNames(
    buttonStyles['icon-button'],
    sizes[size],
    classNameProp
  );

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};
