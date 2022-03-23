import { NextPage } from 'next';
import React, { useMemo } from 'react';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { InfoPanel } from 'astro_2.0/features/pages/nestedDaoPagesContent/GovernanceTokenInfoPageContent';
import { TokenBalance } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/TokenBalance';
import { StakingContract } from 'astro_2.0/features/pages/nestedDaoPagesContent/GovernanceTokenInfoPageContent/components/StakingContract/StakingContract';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import styles from './GovernanceTokenInfoPage.module.scss';

export interface GovernanceTokenInfoPageProps {
  daoContext: DaoContext;
}

const GovernanceTokenInfoPage: NextPage<GovernanceTokenInfoPageProps> = ({
  daoContext,
  daoContext: { dao },
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.TREASURY,
      breadcrumbsConfig.GOVERNANCE_TOKEN_INFO,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeTransfer}
    >
      <>
        <div className={styles.root}>
          <div className={styles.header}>
            <h1>Governance Token</h1>
          </div>
          <div className={styles.content}>
            <InfoPanel className={styles.token}>
              <TokenBalance value={23647} suffix="REF" />
            </InfoPanel>
            <InfoPanel className={styles.distribution}>distribution</InfoPanel>
            <InfoPanel className={styles.contract}>
              <StakingContract />
            </InfoPanel>
          </div>
        </div>
      </>
    </NestedDaoPageWrapper>
  );
};

export default GovernanceTokenInfoPage;
