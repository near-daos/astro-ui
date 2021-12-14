import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';

import { ALL_DAOS_URL } from 'constants/routing';

import { NavLink } from 'astro_2.0/components/NavLink';
import { DaoDetails } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';

import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { PaginationResponse } from 'types/api';

import { Proposal, ProposalVariant } from 'types/proposal';

import { useAuthContext } from 'context/AuthContext';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { DaoContext } from 'types/context';
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
}) => {
  const { accountId } = useAuthContext();
  const { tokens: daoTokens } = useDaoCustomTokens();
  const { t } = useTranslation();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href={ALL_DAOS_URL}>{t('allDaos')}</NavLink>
        <NavLink>{dao.displayName || dao.id}</NavLink>
      </BreadCrumbs>

      <div className={styles.header}>
        <DaoDetails
          key={dao.id}
          className={styles.details}
          dao={dao}
          daoTokens={daoTokens}
          accountId={accountId}
          restrictCreateProposals={!isCanCreateProposals}
          onCreateProposalClick={() => toggleCreateProposal()}
          activeProposals={dao.activeProposalsCount}
          totalProposals={dao.totalProposalsCount}
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
      </div>
    </div>
  );
};

export default DAOHome;
