import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

import { Button } from 'components/button/Button';
import NavLink from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';

import { Proposal, ProposalCategories, ProposalVariant } from 'types/proposal';
import { PaginationResponse } from 'types/api';
import { DAO } from 'types/dao';

import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { ProposalsFeed } from 'astro_2.0/features/Proposals/components';
import { useAuthContext } from 'context/AuthContext';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import styles from './polls.module.scss';

export interface PollsPageProps {
  dao: DAO;
  initialPollsData: PaginationResponse<Proposal[]>;
}

const PollsPage: FC<PollsPageProps> = ({ dao, initialPollsData }) => {
  const router = useRouter();
  const { accountId } = useAuthContext();

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
          onCreateProposalClick={toggleCreateProposal}
        />

        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          proposalVariant={ProposalVariant.ProposePoll}
          onCreate={handleCreateProposal}
          onClose={toggleCreateProposal}
        />
      </div>

      <div className={styles.header}>
        <h1>Polls</h1>
        <Button
          variant="black"
          size="small"
          onClick={() => toggleCreateProposal()}
        >
          Create new poll
        </Button>
      </div>

      <ProposalsFeed
        className={styles.feed}
        dao={dao}
        category={ProposalCategories.Polls}
        initialProposalsData={initialPollsData}
      />
    </div>
  );
};

export default PollsPage;
