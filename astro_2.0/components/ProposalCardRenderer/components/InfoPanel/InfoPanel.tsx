import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { useMountedState } from 'react-use';
import { Icon } from 'components/Icon';
import { useTranslation } from 'next-i18next';

import styles from './InfoPanel.module.scss';

export const InfoPanel: FC = () => {
  const [open, setOpen] = useState(true);
  const isMounted = useMountedState();
  const { t } = useTranslation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isMounted()) {
        setOpen(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMounted]);

  return (
    <div
      data-testid="hover-el"
      className={cn(styles.root, { [styles.open]: open })}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div>
        <Icon name="info" className={styles.infoIcon} />
      </div>
      <div className={styles.message}>{t('popupsInfoWarning')}</div>
    </div>
  );
};
