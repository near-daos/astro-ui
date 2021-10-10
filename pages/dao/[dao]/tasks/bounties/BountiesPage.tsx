import { Button } from 'components/button/Button';
import { Bounty, DeadlineUnit } from 'components/cards/bounty-card/types';
import { useModal } from 'components/modal/hooks';
import Tabs from 'components/tabs/Tabs';
import { BountiesList } from 'features/bounties-list';
import { CreateBountyDialog } from 'features/bounty/dialogs/create-bounty-dialog/create-bounty-dialog';
import styles from 'pages/dao/[dao]/tasks/bounties/bounties.module.scss';
import React, { FC, useCallback } from 'react';
import { SputnikService } from 'services/SputnikService';
import { BountyDoneProposalType } from 'types/proposal';
import { Token } from 'types/token';
import { DAO } from 'types/dao';
import { BountyPageContext } from 'features/bounty/helpers';

const CREATE_BOUNTY_INITIAL = {
  token: Token.NEAR,
  slots: 3,
  amount: 0,
  deadlineThreshold: 3,
  deadlineUnit: 'day' as DeadlineUnit,
  externalUrl: '',
  details: ''
};

interface BountiesPageProps {
  dao: DAO;
  bountiesDone: BountyDoneProposalType[];
  bounties: Bounty[];
}

const BountiesPage: FC<BountiesPageProps> = ({
  dao,
  bountiesDone,
  bounties
}) => {
  const inProgressBounties = bounties.filter(bounty =>
    bounty.claimedBy.find(
      claim => claim.accountId === SputnikService.getAccountId()
    )
  );

  const completedBounties = bountiesDone
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
    },
    dao
  });

  const handleCreateClick = useCallback(() => showCreateBountyDialog(), [
    showCreateBountyDialog
  ]);

  const getContextValue = useCallback(() => {
    return { dao };
  }, [dao]);

  return (
    <BountyPageContext.Provider value={getContextValue()}>
      <div className={styles.root}>
        <div className={styles.header}>
          <span>Bounties</span>
          <Button variant="black" size="small" onClick={handleCreateClick}>
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
    </BountyPageContext.Provider>
  );
};

export default BountiesPage;
