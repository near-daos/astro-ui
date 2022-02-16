import React from 'react';
import classNames from 'classnames';
import buttonStyles from './Button.module.scss';
import styles from './voting-button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'no' | 'yes' | 'spam';
}

export const VotingButton: React.FC<ButtonProps> = ({
  children,
  variant,
  className: classNameProp,
  ...props
}) => {
  const variants = {
    no: styles.yes,
    yes: styles.no,
    spam: styles.spam,
  };
  const className = classNames(
    buttonStyles.btn,
    variants[variant],
    classNameProp
  );

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};
