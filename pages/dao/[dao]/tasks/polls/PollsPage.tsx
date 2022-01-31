import React, { FC } from 'react';

// Constants
import { ALL_DAOS_URL } from 'constants/routing';

// Types
import { PaginationResponse } from 'types/api';
import {
  ProposalVariant,
  ProposalStatuses,
  ProposalCategories,
  ProposalFeedItem,
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

import styles from './Polls.module.scss';

export interface PollsPageProps {
  daoContext: DaoContext;
  initialPollsData: PaginationResponse<ProposalFeedItem[]>;
  initialProposalsStatusFilterValue: ProposalStatuses;
}

const PollsPage: FC<PollsPageProps> = ({
  daoContext: { dao, policyAffectsProposals, userPermissions },
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
          userPermissions={userPermissions}
          onCreateProposalClick={toggleCreateProposal}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          userPermissions={userPermissions}
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
    </div>
  );
};

export default PollsPage;
