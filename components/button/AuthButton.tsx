import React from 'react';
import classNames from 'classnames';
import { Icon } from 'components/Icon';
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
      Sign in with <Icon name="logoNear" height={10} />
    </button>
  );
};
