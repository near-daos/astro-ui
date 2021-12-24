import React, { FC } from 'react';

// Constants
import { ALL_DAOS_URL } from 'constants/routing';

// Types
import { PaginationResponse } from 'types/api';
import {
  Proposal,
  ProposalVariant,
  ProposalStatuses,
  ProposalCategories,
} from 'types/proposal';

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
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import styles from './Polls.module.scss';

export interface PollsPageProps {
  daoContext: DaoContext;
  initialPollsData: PaginationResponse<Proposal[]>;
  initialProposalsStatusFilterValue: ProposalStatuses;
}

const PollsPage: FC<PollsPageProps> = ({
  daoContext: {
    dao,
    policyAffectsProposals,
    userPermissions: { isCanCreateProposals },
  },
  initialPollsData,
  initialProposalsStatusFilterValue,
}) => {
  const { tokens } = useDaoCustomTokens();

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href={ALL_DAOS_URL}>All DAOs</NavLink>
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
          key={Object.keys(tokens).length}
          daoTokens={tokens}
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
          title={<h1 className={styles.header}>Polls</h1>}
          dao={dao}
          showFlag={false}
          className={styles.feed}
          category={ProposalCategories.Polls}
          initialProposals={initialPollsData}
          headerClassName={styles.feedHeader}
          initialProposalsStatusFilterValue={initialProposalsStatusFilterValue}
        />
      )}
    </div>
  );
};

export default PollsPage;
