import cn from 'classnames';
import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { Icon } from 'components/Icon';

import styles from './UsaOnly.module.scss';

interface UsaOnlyProps {
  className?: string;
}

export const UsaOnly: VFC<UsaOnlyProps> = props => {
  const { className } = props;

  const { t } = useTranslation('common');

  return (
    <div className={cn(styles.root, className)}>
      <Icon name="stateAlert" className={styles.icon} />
      <span>({t('myAccountPage.usaOnly')})</span>
    </div>
  );
};
