import React from 'react';
import classNames from 'classnames';
import { ReactComponent as Logo } from 'assets/near.svg';
import styles from './button.module.scss';

type AuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AuthButton: React.VFC<AuthButtonProps> = ({
  className: classNameProp,
  ...props
}) => {
  const className = classNames(
    styles.btn,
    styles.auth,
    styles.large,
    classNameProp
  );

  return (
    <button type="button" className={className} {...props}>
      Sign in with <Logo height="10px" />
    </button>
  );
};
