import React, { FC, useCallback } from 'react';
import Tabs from 'components/tabs/Tabs';
import { Bounty, BountyStatus } from 'components/cards/bounty-card/types';
import { BountiesList } from 'features/bounties-list';
import { CreateBountyDialog } from 'features/bounty/dialogs/create-bounty-dialog/create-bounty-dialog';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal/hooks';
import { BOUNTIES_DATA, CREATE_BOUNTY_INITIAL } from 'lib/mocks/tasks/bounties';
import styles from 'pages/dao/[dao]/tasks/bounties/bounties.module.scss';

interface BountiesPageProps {
  bounties: Bounty[];
}

const BountiesPage: FC<BountiesPageProps> = ({ bounties = BOUNTIES_DATA }) => {
  const openBounties = bounties.filter(
    (bounty: { status: BountyStatus }) => bounty.status === 'Open'
  );
  const inProgressBounties = bounties.filter(
    (bounty: { status: BountyStatus }) => bounty.status === 'In progress'
  );
  const completedBounties = bounties.filter(
    (bounty: { status: BountyStatus }) => bounty.status === 'Completed'
  );
  const numberOpenBounties = openBounties.length;
  const numberInProgressBounties = inProgressBounties.length;
  const numberCompletedBounties = completedBounties.length;

  const tabs = [];
  const tabOpen = {
    id: 1,
    label: `Open (${numberOpenBounties})`,
    content: <BountiesList bountiesList={openBounties} />
  };
  const tabInProgress = {
    id: 2,
    label: `In Progress (${numberInProgressBounties})`,
    content: <BountiesList bountiesList={inProgressBounties} isInProgress />
  };
  const tabCompleted = {
    id: 3,
    label: `Completed (${numberCompletedBounties})`,
    content: <BountiesList bountiesList={completedBounties} />
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
    initialValues: CREATE_BOUNTY_INITIAL
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
