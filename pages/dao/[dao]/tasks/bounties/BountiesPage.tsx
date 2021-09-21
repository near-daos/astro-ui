import React, { FC, useCallback, useEffect, useState } from 'react';
import Tabs from 'components/tabs/Tabs';
import { Bounty, DeadlineUnit } from 'components/cards/bounty-card/types';
import { BountiesList } from 'features/bounties-list';
import { CreateBountyDialog } from 'features/bounty/dialogs/create-bounty-dialog/create-bounty-dialog';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal/hooks';
import styles from 'pages/dao/[dao]/tasks/bounties/bounties.module.scss';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import { SputnikService } from 'services/SputnikService';
import { Token } from 'types/token';
import { useBountiesPerDao } from 'hooks/useBountiesPerDao';
import { BountyDoneProposalType } from 'types/proposal';

const CREATE_BOUNTY_INITIAL = {
  token: Token.NEAR,
  slots: 3,
  amount: 0,
  deadlineThreshold: 3,
  deadlineUnit: 'day' as DeadlineUnit,
  externalUrl: '',
  details: ''
};

const BountiesPage: FC = () => {
  const bounties = useBountiesPerDao();
  const dao = useSelectedDAO();
  const [bountiesDoneProposals, setBountiesDoneProposals] = useState<
    BountyDoneProposalType[]
  >([]);

  useEffect(() => {
    SputnikService.getBountiesDone(dao?.id ?? '').then(bountyDoneProposals => {
      const doneProposals = bountyDoneProposals.map(proposal => {
        return {
          ...(proposal.kind as BountyDoneProposalType),
          completedDate: proposal.createdAt
        };
      });

      setBountiesDoneProposals(doneProposals);
    });
  }, [dao?.id]);

  const inProgressBounties = bounties.filter(bounty =>
    bounty.claimedBy.find(
      claim => claim.accountId === SputnikService.getAccountId()
    )
  );

  const completedBounties = bountiesDoneProposals
    .map(bountyDoneProposal => {
      const completedBounty = bounties.find(
        bounty => bounty.id === bountyDoneProposal.bountyId
      );

      return completedBounty
        ? {
            ...completedBounty,
            completionDate: bountyDoneProposal.completedDate
          }
        : undefined;
    })
    .filter(completedBounty => !!completedBounty) as Bounty[];

  const numberOpenBounties = bounties.length;
  const numberInProgressBounties = inProgressBounties.length;
  const numberCompletedBounties = completedBounties.length;

  const tabs = [];
  const tabOpen = {
    id: 1,
    label: `Open (${numberOpenBounties})`,
    content: <BountiesList bountiesList={bounties} status="Open" />
  };
  const tabInProgress = {
    id: 2,
    label: `In Progress (${numberInProgressBounties})`,
    content: (
      <BountiesList bountiesList={inProgressBounties} status="In progress" />
    )
  };
  const tabCompleted = {
    id: 3,
    label: `Completed (${numberCompletedBounties})`,
    content: (
      <BountiesList bountiesList={completedBounties} status="Completed" />
    )
  };

  if (numberOpenBounties > 0) {
    tabs.push(tabOpen);
  }

  if (numberInProgressBounties > 0) {
    tabs.push(tabInProgress);
  }

  if (numberCompletedBounties > 0) {
    tabs.push(tabCompleted);
  }

  const [showCreateBountyDialog] = useModal(CreateBountyDialog, {
    initialValues: {
      ...CREATE_BOUNTY_INITIAL
    }
  });

  const handleCreateClick = useCallback(() => showCreateBountyDialog(), [
    showCreateBountyDialog
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>Bounties</div>
      <div className={styles.create}>
        <Button variant="secondary" onClick={handleCreateClick}>
          Create new bounty
        </Button>
      </div>
      <div className={styles.description}>
        Projects, tasks and other work the DAO wants done.
      </div>
      <div className={styles.bounties}>
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default BountiesPage;
