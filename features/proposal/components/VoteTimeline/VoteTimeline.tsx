import React, { FC } from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { ProposalActionData, ProposalFeedItem } from 'types/proposal';
import { Icon } from 'components/Icon';
import { VoteAction } from 'features/proposal/components/VoteTimeline/VoteAction';
import { FinishProposal } from 'features/proposal/components/VoteTimeline/FinishProposal';
import { ExtraVotes } from 'features/proposal/components/VoteTimeline/ExtraVotes';
import { formatTimestampAsDate, toMillis } from 'utils/format';

import styles from './VoteTimeline.module.scss';

interface VoteTimelineProps {
  className?: string;
  proposal: ProposalFeedItem;
}

const TOTAL = 5;

type VoteActionItem = {
  action: ProposalActionData | null;
  left: number;
};

const acts: ProposalActionData[] = [
  {
    accountId: 'chloe.testnet',
    action: 'VoteApprove',
    id: 'marmaj.sputnikv2.testnet-56-chloe.testnet-VoteApprove',
    proposalId: 'marmaj.sputnikv2.testnet-56',
    timestamp: '1640988000000',
    transactionHash: '72i3tPn4xXaH1BdZkNpX2U5Kd9LB8xmYRzvF3vpJkpv9',
  },
  {
    accountId: 'chloe.testnet',
    action: 'VoteApprove',
    id: 'marmaj.sputnikv2.testnet-56-chloe.testnet-VoteApprove',
    proposalId: 'marmaj.sputnikv2.testnet-56',
    timestamp: '1640988000000000',
    transactionHash: '72i3tPn4xXaH1BdZkNpX2U5Kd9LB8xmYRzvF3vpJkpv9',
  },
  {
    accountId: 'chloe.testnet',
    action: 'VoteApprove',
    id: 'marmaj.sputnikv2.testnet-56-chloe.testnet-VoteApprove',
    proposalId: 'marmaj.sputnikv2.testnet-56',
    timestamp: '1641765466666000',
    transactionHash: '72i3tPn4xXaH1BdZkNpX2U5Kd9LB8xmYRzvF3vpJkpv9',
  },
];

export const VoteTimeline: FC<VoteTimelineProps> = ({
  className,
  proposal,
}) => {
  const startTimestamp = new Date(1640988000).getTime(); // 1.01.2022
  const actions: ProposalActionData[] = acts.slice(1);
  const diff = new Date(1661979600).getTime() - startTimestamp; // 9.01.2022
  const step = Math.floor(diff / TOTAL);
  const externalActions: ProposalActionData[] = [];
  const voteActions: VoteActionItem[] = Array.from(new Array(TOTAL)).map(
    () => ({
      action: null,
      left: 0,
    })
  );

  voteActions.forEach((_, index) => {
    const from = startTimestamp + step * index;
    const to = startTimestamp + step * (index + 1);

    actions.forEach(action => {
      const timestamp = toMillis(action.timestamp);

      if (timestamp >= from && timestamp <= to) {
        for (let i = index; i < TOTAL; i += 1) {
          if (!voteActions[i].action) {
            voteActions[i].action = action;
            break;
          }

          if (TOTAL - 1 === i) {
            const emptyIndex = i;

            for (let j = i; j < TOTAL; i += 1) {
              let swap = '';
            }
          }
        }
      }
    });
  });

  console.log('voteActions', voteActions);

  return (
    <div className={cn(styles.voteTimeline, className)}>
      <div className={styles.createProposal}>
        <div className={styles.successPoint}>
          <Icon name="statusSuccess" className={styles.statusSuccess} />
        </div>
        <div className={styles.text}>Creating proposal</div>
      </div>
      <div className={styles.line}>
        <div className={styles.successLine} style={{ width: 0 }} />
        <ExtraVotes actions={externalActions} />

        {voteActions.map(voteAction => {
          if (!isEmpty(voteAction.action)) {
            return (
              <VoteAction
                type="approved"
                position={`${voteAction.left}px`}
                date={
                  voteAction?.action?.timestamp
                    ? formatTimestampAsDate(voteAction.action.timestamp)
                    : ''
                }
                name={voteAction?.action?.accountId || ''}
              />
            );
          }

          return null;
        })}
      </div>

      <FinishProposal status={proposal.status} />
    </div>
  );
};
