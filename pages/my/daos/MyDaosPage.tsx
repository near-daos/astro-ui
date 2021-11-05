import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

import { useNearPrice } from 'hooks/useNearPrice';

import DaoCard from 'components/cards/dao-card';
import { Button } from 'components/button/Button';
import { CREATE_DAO_URL } from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { NoResultsView } from 'features/no-results-view';

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
    if (isEmpty(accountDaos)) {
      return (
        <NoResultsView
          title={
            <span>
              You have no DAOs, but you can{' '}
              <Link passHref href={CREATE_DAO_URL}>
                <span className={styles.createDaoLink}>create</span>
              </Link>{' '}
              one
            </span>
          }
        />
      );
    }

    const daoEls = accountDaos.map(dao => {
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

    return <div className={styles.content}>{daoEls}</div>;
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
      {renderDaos()}
    </div>
  );
};

export default MyDaosPage;
