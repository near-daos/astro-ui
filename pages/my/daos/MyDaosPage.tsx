import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

import { Button } from 'components/button/Button';

import { CREATE_DAO_URL } from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';

import { DAO } from 'types/dao';

import styles from './MyDaosPage.module.scss';

interface MyDaosPageProps {
  accountDaos: DAO[];
}

const MyDaosPage: FC<MyDaosPageProps> = ({ accountDaos }) => {
  const router = useRouter();
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
      const { id, activeProposalsCount, totalProposalsCount } = dao;

      return (
        <DaoDetailsGrid
          key={id}
          dao={dao}
          activeProposals={activeProposalsCount}
          totalProposals={totalProposalsCount}
        />
      );
    });

    return <div className={styles.daosList}>{daoEls}</div>;
  }

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>MY DAOs</h1>
        <Button variant="black" size="small" onClick={handleCreateDao}>
          Create new DAO
        </Button>
      </div>
      <div className={styles.content}>{renderDaos()}</div>
    </div>
  );
};

export default MyDaosPage;
