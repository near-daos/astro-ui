import { FC, PropsWithChildren } from 'react';

import styles from './ContactValue.module.scss';

interface ContactProps extends PropsWithChildren {
  isVerified: boolean;
}

export const ContactValue: FC<ContactProps> = props => {
  const { children, isVerified } = props;

  if (isVerified) {
    return <div className={styles.root}>{children}</div>;
  }

  return null;
};
