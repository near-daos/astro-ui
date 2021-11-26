import React, { FC } from 'react';

// Types
import { PaginationResponse } from 'types/api';
import { Proposal, ProposalCategories, ProposalVariant } from 'types/proposal';

// Components
import { Feed } from 'astro_2.0/features/Feed';
import { NavLink } from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

// Hooks
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { DaoContext } from 'types/context';
import { NoResultsView } from 'features/no-results-view';
import styles from './Polls.module.scss';

export interface PollsPageProps {
  daoContext: DaoContext;
  initialPollsData: PaginationResponse<Proposal[]>;
}

const PollsPage: FC<PollsPageProps> = ({
  daoContext: {
    dao,
    policyAffectsProposals,
    userPermissions: { isCanCreateProposals },
  },
  initialPollsData,
}) => {
  const { tokens } = useDaoCustomTokens();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

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
          disableNewProposal={!isCanCreateProposals}
          onCreateProposalClick={toggleCreateProposal}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          proposalVariant={ProposalVariant.ProposePoll}
          showFlag={false}
          onClose={toggleCreateProposal}
        />

        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>

      {initialPollsData.count === 0 ? (
        <NoResultsView title="No polls available" />
      ) : (
        <Feed
          title={
            <div className={styles.headerContainer}>
              <h1 className={styles.header}>Polls</h1>
            </div>
          }
          dao={dao}
          showFlag={false}
          daoTokens={tokens}
          className={styles.feed}
          category={ProposalCategories.Polls}
          initialProposals={initialPollsData}
          headerClassName={styles.feedHeader}
        />
      )}
    </div>
  );
};

export default PollsPage;
