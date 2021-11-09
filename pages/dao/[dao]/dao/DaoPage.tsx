import React, { useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { DaoDetails } from 'astro_2.0/components/DaoDetails';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import NavLink from 'astro_2.0/components/NavLink';

import { ProposalsFeed } from 'astro_2.0/features/Proposals/components';

import { Proposal, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { PaginationResponse } from 'types/api';

import { useAuthContext } from 'context/AuthContext';
import { useCustomTokensContext } from 'context/CustomTokensContext';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { getActiveProposalsCountByDao } from 'hooks/useAllProposals';

import styles from './dao-page.module.scss';

interface DaoHomeProps {
  dao: DAO;
  tokens: Token[];
  policyAffectsProposals: Proposal[];
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const DAOHome: NextPage<DaoHomeProps> = ({
  dao,
  tokens,
  initialProposalsData,
  policyAffectsProposals,
}) => {
  const router = useRouter();

  const { accountId } = useAuthContext();
  const { setTokens } = useCustomTokensContext();

  const { active, total } = getActiveProposalsCountByDao(
    initialProposalsData.data
  );

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  useEffect(() => {
    setTokens(tokens);
  }, [tokens, setTokens]);

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
          className={styles.details}
          dao={dao}
          accountId={accountId}
          restrictCreateProposals={policyAffectsProposals.length > 0}
          onCreateProposalClick={() => toggleCreateProposal()}
          activeProposals={active[dao.id] || 0}
          totalProposals={total[dao.id] || 0}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onCreate={handleCreateProposal}
          onClose={toggleCreateProposal}
        />
      </div>

      {!!policyAffectsProposals?.length && (
        <div className={styles.warningWrapper}>
          <PolicyAffectedWarning data={policyAffectsProposals} />
        </div>
      )}

      <ProposalsFeed
        className={styles.feed}
        title="Proposals"
        dao={dao}
        initialProposalsData={initialProposalsData}
      />
    </div>
  );
};

export default DAOHome;
