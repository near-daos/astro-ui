import { Button } from 'components/button/Button';
import { Bounty, DeadlineUnit } from 'components/cards/bounty-card/types';
import { useModal } from 'components/modal/hooks';
import Tabs from 'components/tabs/Tabs';
import { BountiesList } from 'features/bounties-list';
import { CreateBountyDialog } from 'features/bounty/dialogs/create-bounty-dialog/CreateBountyDialog';
import styles from 'pages/dao/[dao]/tasks/bounties/bounties.module.scss';
import React, { FC, useCallback } from 'react';
import { SputnikNearService } from 'services/sputnik';
import { BountyDoneProposalType } from 'types/proposal';
import { DAO } from 'types/dao';
import { BountyPageContext } from 'features/bounty/helpers';
import { useAuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { Tokens } from 'context/CustomTokensContext';

const CREATE_BOUNTY_INITIAL = {
  token: 'NEAR',
  slots: 3,
  amount: 0,
  deadlineThreshold: 3,
  deadlineUnit: 'day' as DeadlineUnit,
  externalUrl: '',
  details: '',
};

export interface BountiesPageProps {
  dao: DAO;
  bountiesDone: BountyDoneProposalType[];
  bounties: Bounty[];
  tokens: Tokens;
}

const BountiesPage: FC<BountiesPageProps> = ({
  dao,
  bountiesDone,
  bounties,
  tokens,
}) => {
  const { accountId, login } = useAuthContext();
  const router = useRouter();

  const inProgressBounties = bounties.filter(bounty =>
    bounty.claimedBy.find(
      claim => claim.accountId === SputnikNearService.getAccountId()
    )
  );

  const openBounties = bounties.filter(bounty => bounty.slots !== 0);

  const completedBounties = bountiesDone
    .map(bountyDoneProposal => {
      const completedBounty = bounties.find(
        bounty => bounty.id === bountyDoneProposal.bountyId
      );

      return completedBounty
        ? {
            ...completedBounty,
            completionDate: bountyDoneProposal.completedDate,
          }
        : undefined;
    })
    .filter(completedBounty => !!completedBounty) as Bounty[];

  const numberOpenBounties = openBounties.length;
  const numberInProgressBounties = inProgressBounties.length;
  const numberCompletedBounties = completedBounties.length;

  const tabOpen = {
    id: 1,
    label: `Open (${numberOpenBounties})`,
    content: <BountiesList bountiesList={openBounties} status="Open" />,
  };
  const tabInProgress = {
    id: 2,
    label: `In Progress (${numberInProgressBounties})`,
    content: (
      <BountiesList bountiesList={inProgressBounties} status="In progress" />
    ),
  };
  const tabCompleted = {
    id: 3,
    label: `Completed (${numberCompletedBounties})`,
    content: (
      <BountiesList bountiesList={completedBounties} status="Completed" />
    ),
  };

  const tabs = [tabOpen, tabInProgress, tabCompleted];

  const [showCreateBountyDialog] = useModal(CreateBountyDialog, {
    initialValues: {
      ...CREATE_BOUNTY_INITIAL,
    },
    dao,
    tokens,
  });

  const handleCreateClick = useCallback(async () => {
    if (!accountId) {
      login();
    } else {
      const result = await showCreateBountyDialog();

      if (result.includes('submitted')) {
        await router.push(`/dao/${dao?.id}`);
      }
    }
  }, [accountId, login, showCreateBountyDialog, router, dao?.id]);

  const getContextValue = useCallback(() => {
    return { dao, tokens };
  }, [dao, tokens]);

  return (
    <BountyPageContext.Provider value={getContextValue()}>
      <div className={styles.root}>
        <div className={styles.header}>
          <h1>Bounties</h1>
          <Button variant="black" size="small" onClick={handleCreateClick}>
            New bounty proposal
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
