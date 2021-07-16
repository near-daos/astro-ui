import React from 'react';
import classNames from 'classnames';
import buttonStyles from './button.module.scss';
import styles from './voting-button.module.scss';

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant: 'no' | 'yes' | 'spam';
  type: 'button' | 'submit' | 'reset' | undefined;
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
    spam: styles.spam
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
