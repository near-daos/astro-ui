import { FC } from 'react';

import { Icon, IconName } from 'components/Icon';

import styles from './ContactInfo.module.scss';

interface ContactInfoProps {
  icon: IconName;
}

export const ContactInfo: FC<ContactInfoProps> = props => {
  const { icon, children } = props;

  return (
    <div className={styles.root}>
      <div className={styles.iconHolder}>
        <Icon name={icon} className={styles.icon} />
      </div>
      {children}
    </div>
  );
};
