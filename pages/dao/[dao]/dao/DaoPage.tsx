import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';

import { Feed } from 'astro_2.0/features/Feed';
import { NavLink } from 'astro_2.0/components/NavLink';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { DaoDashboard } from 'astro_2.0/features/DaoDashboard';

import { PaginationResponse } from 'types/api';
import { Proposal, ProposalVariant } from 'types/proposal';

import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import { DaoContext } from 'types/context';
import { DaoDashboardHeader } from 'astro_2.0/features/DaoDashboardHeader';
import styles from './DaoPage.module.scss';

interface DaoHomeProps {
  daoContext: DaoContext;
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const DAOHome: NextPage<DaoHomeProps> = ({
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
  initialProposalsData,
}) => {
  const { tokens: daoTokens } = useDaoCustomTokens();
  const { t } = useTranslation();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">{t('allDaos')}</NavLink>
        <NavLink>{dao.displayName || dao.id}</NavLink>
      </BreadCrumbs>

      <div className={styles.header}>
        <DaoDetailsMinimized
          key={`details_${dao.id}`}
          dao={dao}
          disableNewProposal={!isCanCreateProposals}
          onCreateProposalClick={() => toggleCreateProposal()}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          key={Object.keys(daoTokens).length}
          daoTokens={daoTokens}
          showFlag={false}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onClose={toggleCreateProposal}
        />

        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />

        <DaoDashboardHeader dao={dao} className={styles.dashboardHeader} />

        <DaoDashboard
          key={`dashboard_${dao.id}`}
          dao={dao}
          daoTokens={daoTokens}
          className={styles.dashboard}
          proposalsInTotal={{ count: 135, growth: 10 }}
          nfts={{ count: 4, growth: 2 }}
          bounties={{ count: 14, growth: -7 }}
          funds={{ count: 1235633, growth: 10 }}
          activeProposals={{ count: 8, growth: 10 }}
        />
      </div>

      <Feed
        key={dao.id}
        dao={dao}
        showFlag={false}
        title={t('proposals')}
        className={styles.feed}
        initialProposals={initialProposalsData}
      />
    </div>
  );
};

export default DAOHome;
