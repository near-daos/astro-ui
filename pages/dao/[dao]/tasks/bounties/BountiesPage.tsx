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
import { BountyResponse } from 'types/bounties';
import { Token } from 'types/token';

export const CREATE_BOUNTY_INITIAL = {
  token: Token.NEAR,
  slots: 3,
  amount: 0,
  deadlineThreshold: 3,
  deadlineUnit: 'day' as DeadlineUnit,
  externalUrl: '',
  details: ''
};

const BountiesPage: FC = () => {
  const selectedDao = useSelectedDAO();
  const [bounties, setBounties] = useState<Bounty[]>([]);

  useEffect(() => {
    if (!selectedDao) {
      return;
    }

    SputnikService.getBountiesByDaoId(selectedDao.id).then(result => {
      const data: Bounty[] = result.map(
        (response: BountyResponse): Bounty => {
          return {
            amount: response.amount,
            forgivenessPeriod: response.dao.policy.bountyForgivenessPeriod,
            claimedBy: response.bountyClaims.map(claim => ({
              deadline: claim.deadline,
              accountId: claim.accountId,
              starTime: claim.startTime
            })),
            deadlineThreshold: response.maxDeadline,
            slots: Number(response.times),
            id: response.bountyId,
            token: 'NEAR',
            description: response.description
          };
        }
      );

      setBounties(data);
    });
  }, [selectedDao]);

  const inProgressBounties = bounties.filter(bounty =>
    bounty.claimedBy.find(
      claim => claim.accountId === SputnikService.getAccountId()
    )
  );

  const numberOpenBounties = bounties.length;
  const numberInProgressBounties = inProgressBounties.length;
  const numberCompletedBounties = 0;

  const tabs = [];
  const tabOpen = {
    id: 1,
    label: `Open (${numberOpenBounties})`,
    content: <BountiesList bountiesList={bounties} inProgress={false} />
  };
  const tabInProgress = {
    id: 2,
    label: `In Progress (${numberInProgressBounties})`,
    content: <BountiesList bountiesList={inProgressBounties} inProgress />
  };
  const tabCompleted = {
    id: 3,
    label: `Completed (${numberCompletedBounties})`,
    content: <BountiesList bountiesList={[]} inProgress={false} />
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
