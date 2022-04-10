import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { IconName } from 'components/Icon';

import { CardLine } from 'astro_2.0/features/pages/myAccount/cards/CardLine';
import { ContactInfo } from 'astro_2.0/features/pages/myAccount/cards/ContactInfo';

import { ContactValue } from './components/ContactValue';
import { ContactAddEditButton } from './components/ContactAddEditButton';

import styles from './ContactLine.module.scss';

interface ContactLineProps {
  icon: IconName;
  label: string;
  contact: string;
  isVerified: boolean;
  onButtonClick: () => void;
}

export const ContactLine: FC<ContactLineProps> = props => {
  const { icon, label, contact, isVerified, onButtonClick } = props;

  const { t } = useTranslation('common');

  return (
    <CardLine className={styles.emailLine}>
      <ContactInfo icon={icon}>
        {t(label)}
        {isVerified && ':'}
      </ContactInfo>
      <div className={styles.rightPart}>
        <ContactValue isVerified={isVerified}>{contact}</ContactValue>
        <ContactAddEditButton
          isEdit={isVerified}
          onClick={onButtonClick}
          className={styles.addButton}
        />
      </div>
    </CardLine>
  );
};
