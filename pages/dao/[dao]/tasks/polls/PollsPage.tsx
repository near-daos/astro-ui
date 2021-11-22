import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

// Types
import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';
import { Proposal, ProposalCategories, ProposalVariant } from 'types/proposal';

// Components
import { Feed } from 'astro_2.0/features/Feed';
import { Button } from 'components/button/Button';
import { NavLink } from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

// Hooks
import { useAuthContext } from 'context/AuthContext';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './polls.module.scss';

export interface PollsPageProps {
  dao: DAO;
  initialPollsData: PaginationResponse<Proposal[]>;
  policyAffectsProposals: Proposal[];
}

const PollsPage: FC<PollsPageProps> = ({
  dao,
  initialPollsData,
  policyAffectsProposals,
}) => {
  const router = useRouter();
  const { accountId } = useAuthContext();
  const { tokens } = useDaoCustomTokens();

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
        <NavLink href={`/dao/${dao.id}`}>{dao?.displayName || dao?.id}</NavLink>
        <span>Polls</span>
      </BreadCrumbs>

      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          disableNewProposal={!!policyAffectsProposals.length}
          onCreateProposalClick={toggleCreateProposal}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          proposalVariant={ProposalVariant.ProposePoll}
          showFlag={false}
          onCreate={handleCreateProposal}
          onClose={toggleCreateProposal}
        />

        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>

      <Feed
        title={
          <div className={styles.headerContainer}>
            <h1 className={styles.header}>Polls</h1>
            <Button
              variant="black"
              size="small"
              disabled={!!policyAffectsProposals.length}
              onClick={() => toggleCreateProposal()}
            >
              Create new poll
            </Button>
          </div>
        }
        dao={dao}
        showFlag={false}
        daoTokens={tokens}
        className={styles.feed}
        category={ProposalCategories.Polls}
        initialProposals={initialPollsData}
      />
    </div>
  );
};

export default PollsPage;
