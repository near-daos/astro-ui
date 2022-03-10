import { NextPage } from 'next';
import React, { useMemo } from 'react';

import { PaginationResponse } from 'types/api';
import { Proposal } from 'types/proposal';
import { DaoContext } from 'types/context';

import { DaoDashboard } from 'astro_2.0/features/DaoDashboard';
import { DaoDashboardHeader } from 'astro_2.0/features/DaoDashboardHeader';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import styles from './DaoPage.module.scss';

interface DaoHomeProps {
  daoContext: DaoContext;
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const DAOHome: NextPage<DaoHomeProps> = ({ daoContext }) => {
  const { dao } = daoContext;
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

  const breadcrumbs = useMemo(() => {
    return [breadcrumbsConfig.ALL_DAOS_URL, breadcrumbsConfig.SINGLE_DAO_PAGE];
  }, [breadcrumbsConfig]);

  return (
    <>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        className={styles.pageWrapper}
      >
        <DaoDashboardHeader dao={dao} className={styles.header} />
        <DaoDashboard
          key={`dashboard_${dao.id}`}
          className={styles.dashboard}
        />
      </NestedDaoPageWrapper>
    </>
  );
};

export default DAOHome;
