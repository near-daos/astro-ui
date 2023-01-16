import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';

import { PaginationResponse } from 'types/api';
import { Proposal } from 'types/proposal';
import { DaoContext } from 'types/context';

import { DaoDashboard } from 'astro_2.0/features/DaoDashboard';
import { DaoDashboardHeader } from 'astro_2.0/features/DaoDashboardHeader';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { Page } from 'pages/_app';

import { useAppVersion } from 'hooks/useAppVersion';

import { useDaoContext } from 'services/ApiService/hooks/useDaoContext';
import { useRouter } from 'next/router';
import { Loader } from 'components/loader';

import styles from './DaoPage.module.scss';

interface DaoHomeProps {
  initialProposalsData: PaginationResponse<Proposal[]>;
  defaultApplicationUiVersion: number;
  daoContext: DaoContext | null;
}

const DAOHome: Page<DaoHomeProps> = ({
  defaultApplicationUiVersion,
  daoContext,
}) => {
  const router = useRouter();
  const { dao: daoId } = router.query;

  const contextFromOpenSearch = useDaoContext(daoId as string);
  const context = contextFromOpenSearch ?? daoContext ?? ({} as DaoContext);
  const { dao, userPermissions } = context;

  const { appVersion: selectedAppVersion } = useAppVersion();
  const appVersion = selectedAppVersion || defaultApplicationUiVersion;

  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoId as string,
    dao?.displayName ?? ''
  );

  const breadcrumbs = useMemo(() => {
    return [breadcrumbsConfig.ALL_DAOS_URL, breadcrumbsConfig.SINGLE_DAO_PAGE];
  }, [breadcrumbsConfig]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!dao) {
        router.push('/404');
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dao, router]);

  if (!context || !dao || !userPermissions) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>DAO Main Page</title>
      </Head>
      <NestedDaoPageWrapper
        daoContext={context}
        breadcrumbs={appVersion === 3 ? undefined : breadcrumbs}
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
          daoContext={context}
          key={`dashboard_${dao.id}`}
          className={styles.dashboard}
        />
      </NestedDaoPageWrapper>
    </>
  );
};

export default DAOHome;
