import React, { useMemo } from 'react';
import Head from 'next/head';

import { PaginationResponse } from 'types/api';
import { Proposal } from 'types/proposal';
import { DaoContext } from 'types/context';

import { DaoDashboard } from 'astro_2.0/features/DaoDashboard';
import { DaoDashboardHeader } from 'astro_2.0/features/DaoDashboardHeader';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { Page } from 'pages/_app';

import styles from './DaoPage.module.scss';

interface DaoHomeProps {
  daoContext: DaoContext;
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const DAOHome: Page<DaoHomeProps> = ({ daoContext }) => {
  const { dao, userPermissions } = daoContext;

  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

  const breadcrumbs = useMemo(() => {
    return [breadcrumbsConfig.ALL_DAOS_URL, breadcrumbsConfig.SINGLE_DAO_PAGE];
  }, [breadcrumbsConfig]);

  return (
    <>
      <Head>
        <title>DAO Main Page</title>
      </Head>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        className={styles.pageWrapper}
        header={onCreateProposal => {
          return (
            <DaoDashboardHeader
              userPermissions={userPermissions}
              dao={dao}
              className={styles.header}
              onCreateProposal={onCreateProposal}
            />
          );
        }}
      >
        <DaoDashboard
          key={`dashboard_${dao.id}`}
          className={styles.dashboard}
        />
      </NestedDaoPageWrapper>
    </>
  );
};

export default DAOHome;
