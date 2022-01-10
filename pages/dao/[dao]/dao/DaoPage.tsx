import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';

import { ALL_DAOS_URL } from 'constants/routing';

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
  daoContext: { dao, userPermissions, policyAffectsProposals },
}) => {
  const { tokens: daoTokens } = useDaoCustomTokens();
  const { t } = useTranslation();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href={ALL_DAOS_URL}>{t('allDaos')}</NavLink>
        <NavLink>{dao.displayName || dao.id}</NavLink>
      </BreadCrumbs>

      <DaoDashboardHeader dao={dao} className={styles.header} />

      <div className={styles.navigation}>
        <DaoDetailsMinimized
          key={`details_${dao.id}`}
          dao={dao}
          userPermissions={userPermissions}
          onCreateProposalClick={() => toggleCreateProposal()}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          userPermissions={userPermissions}
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
      </div>

      <DaoDashboard
        key={`dashboard_${dao.id}`}
        dao={dao}
        daoTokens={daoTokens}
        className={styles.dashboard}
      />
    </div>
  );
};

export default DAOHome;
