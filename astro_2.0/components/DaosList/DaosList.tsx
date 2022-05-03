import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { CREATE_DAO_URL } from 'constants/routing';

import { useWalletContext } from 'context/WalletContext';

import { WalletType } from 'types/config';
import styles from './DaosList.module.scss';

interface DaosListProps {
  label: string;
}

export const DaosList: FC<DaosListProps> = ({ label, children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { accountId, login } = useWalletContext();

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login(WalletType.NEAR)),
    [login, router, accountId]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t(label)}</h1>
        <Button variant="black" size="small" onClick={handleCreateDao}>
          {t('createNewDao')}
        </Button>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
