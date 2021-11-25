import { NextPage } from 'next';
import React from 'react';

import { Feed } from 'astro_2.0/features/Feed';
import { NavLink } from 'astro_2.0/components/NavLink';
import { DaoDetails } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';

import { PaginationResponse } from 'types/api';
import { Proposal, ProposalVariant } from 'types/proposal';

import { useAuthContext } from 'context/AuthContext';

import { useNearPrice } from 'hooks/useNearPrice';
import { useAllCustomTokens } from 'hooks/useCustomTokens';
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
  initialProposalsData,
}) => {
  const nearPrice = useNearPrice();

  const { accountId } = useAuthContext();
  const { tokens } = useAllCustomTokens();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink>{dao.displayName || dao.id}</NavLink>
      </BreadCrumbs>

      <div className={styles.header}>
        <DaoDetails
          key={dao.id}
          nearPrice={nearPrice}
          className={styles.details}
          dao={dao}
          accountId={accountId}
          restrictCreateProposals={!isCanCreateProposals}
          onCreateProposalClick={() => toggleCreateProposal()}
          activeProposals={dao.activeProposalsCount}
          totalProposals={dao.totalProposalsCount}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          showFlag={false}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onClose={toggleCreateProposal}
        />

        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>

      <Feed
        key={dao.id}
        dao={dao}
        showFlag={false}
        title="Proposals"
        daoTokens={tokens}
        className={styles.feed}
        initialProposals={initialProposalsData}
      />
    </div>
  );
};

export default DAOHome;
