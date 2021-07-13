import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import styles from './button.module.scss';

interface AuthButtonProps extends React.HTMLProps<HTMLButtonElement> {
  type: 'button' | 'submit' | 'reset' | undefined;
}

export const AuthButton: React.VFC<AuthButtonProps> = ({
  className: classNameProp,
  ...props
}) => {
  const className = classNames(styles.btn, styles.auth, classNameProp);

  return (
    <button type="button" className={className} {...props}>
      Sign in with{' '}
      <Image src="/near.svg" alt="Near Logo" width={42} height={10} />
    </button>
  );
};
