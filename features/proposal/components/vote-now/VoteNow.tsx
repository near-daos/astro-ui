import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { VoteStat } from 'features/types';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { ProgressBar } from 'components/vote-details/components/progress-bar/ProgressBar';

import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletError } from 'errors/SputnikWalletError';
import { Proposal } from 'types/proposal';

import styles from './vote-now.module.scss';

interface VoteNowProp {
  data: VoteStat[];
  proposal: Proposal;
}

export const VoteNow: FC<VoteNowProp> = ({ data, proposal }) => {
  const router = useRouter();
  const votesYes = data.find(item => item.vote === 'Yes');
  const votesNo = data.find(item => item.vote === 'No');

  const handleVote = useCallback(
    async (action: 'VoteApprove' | 'VoteReject') => {
      try {
        await SputnikNearService.vote(
          proposal.daoId,
          proposal.proposalId,
          action
        );

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds.`,
          lifetime: 20000,
        });

        await router.replace(router.asPath);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [proposal.daoId, proposal.proposalId, router]
  );

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <ProgressBar detail={{ data, limit: '100%', label: '' }} />
      </div>
      <div className={styles.row}>
        <Button
          onClick={() => handleVote('VoteApprove')}
          variant="secondary"
          className={cn(styles.button, styles.yes)}
          size="small"
        >
          <Icon width={24} name="votingYes" /> Yes ({votesYes?.value})
        </Button>
        <Button
          onClick={() => handleVote('VoteReject')}
          variant="secondary"
          className={cn(styles.button, styles.no)}
          size="small"
        >
          <Icon width={24} name="votingNo" /> No ({votesNo?.value})
        </Button>
      </div>
    </div>
  );
};
