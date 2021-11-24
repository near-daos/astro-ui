import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { Feed } from 'astro_2.0/features/Feed';
import { NavLink } from 'astro_2.0/components/NavLink';
import { DaoDetails } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';

import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { PaginationResponse } from 'types/api';
import { Proposal, ProposalVariant } from 'types/proposal';

import { useAuthContext } from 'context/AuthContext';

import { useNearPrice } from 'hooks/useNearPrice';
import { useAllCustomTokens } from 'hooks/useCustomTokens';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import styles from './DaoPage.module.scss';

interface DaoHomeProps {
  dao: DAO;
  tokens: Token[];
  policyAffectsProposals: Proposal[];
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const DAOHome: NextPage<DaoHomeProps> = ({
  dao,
  initialProposalsData,
  policyAffectsProposals,
}) => {
  const router = useRouter();
  const nearPrice = useNearPrice();

  const { accountId } = useAuthContext();
  const { tokens } = useAllCustomTokens();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const refreshData = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  const handleCreateProposal = useCallback(
    (isSuccess: boolean) => {
      if (isSuccess) {
        refreshData();
        toggleCreateProposal();
      }
    },
    [refreshData, toggleCreateProposal]
  );

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink>{dao.displayName || dao.id}</NavLink>
      </BreadCrumbs>

      <div className={styles.header}>
        <DaoDetails
          nearPrice={nearPrice}
          className={styles.details}
          dao={dao}
          accountId={accountId}
          restrictCreateProposals={policyAffectsProposals.length > 0}
          onCreateProposalClick={() => toggleCreateProposal()}
          activeProposals={dao.activeProposalsCount}
          totalProposals={dao.totalProposalsCount}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          showFlag={false}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onCreate={handleCreateProposal}
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
