import React, { FC, useCallback } from 'react';

import { useNearPrice } from 'hooks/useNearPrice';

import DaoCard from 'components/cards/dao-card';
import { Button } from 'components/button/Button';
import { CREATE_DAO_URL } from 'constants/routing';

import { useRouter } from 'next/router';
import { useAuthContext } from 'context/AuthContext';

import { DAO } from 'types/dao';
import styles from './MyDaosPage.module.scss';

interface MyDaosPageProps {
  accountDaos: DAO[];
}

const MyDaosPage: FC<MyDaosPageProps> = ({ accountDaos }) => {
  const router = useRouter();
  const nearPrice = useNearPrice();
  const { accountId, login } = useAuthContext();

  function renderDaos() {
    return accountDaos.map(dao => {
      const { id, logo, name, displayName, description, members } = dao;

      return (
        <DaoCard
          dao={dao}
          key={id}
          flag={logo}
          name={name}
          displayName={displayName}
          daoAccountName={id}
          nearPrice={nearPrice}
          description={description}
          members={members}
        />
      );
    });
  }

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>My DAOs</h1>
        <Button variant="black" size="small" onClick={handleCreateDao}>
          Create new DAO
        </Button>
      </div>
      <div className={styles.content}>{renderDaos()}</div>
    </div>
  );
};

export default MyDaosPage;
