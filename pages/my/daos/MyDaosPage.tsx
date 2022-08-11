import React, { ReactNode } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import Head from 'next/head';

import { DaoFeedItem } from 'types/dao';

import { CREATE_DAO_URL } from 'constants/routing';
import { DaosList } from 'astro_2.0/components/DaosList';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';

import { Page } from 'pages/_app';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import styles from './MyDaosPage.module.scss';

interface MyDaosPageProps {
  accountDaos: DaoFeedItem[];
}

const MyDaosPage: Page<MyDaosPageProps> = ({ accountDaos }) => {
  function renderDaos() {
    if (isEmpty(accountDaos)) {
      return (
        <div className={styles.noResults}>
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
        </div>
      );
    }

    const daoEls = accountDaos.map(dao => {
      const { id, activeProposalCount, totalProposalCount } = dao;

      return (
        <DaoDetailsGrid
          key={id}
          dao={dao}
          activeProposals={activeProposalCount}
          totalProposals={totalProposalCount}
        />
      );
    });

    const daosListClassList = cn(styles.daosList, {
      [styles.singleDao]: accountDaos.length === 1,
    });

    return <div className={daosListClassList}>{daoEls}</div>;
  }

  return (
    <DaosList label="myDaos">
      <Head>
        <title>My DAOs</title>
      </Head>
      {renderDaos()}
    </DaosList>
  );
};

MyDaosPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default MyDaosPage;
