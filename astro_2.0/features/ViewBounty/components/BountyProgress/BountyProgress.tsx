import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import { AddBountyRequest, ProposalType } from 'types/proposal';
import { Bounty, BountyProposal } from 'types/bounties';

import styles from './BountyProgress.module.scss';

interface BountyProgressProps {
  proposal: BountyProposal;
  bounty?: Bounty;
}

export const BountyProgress: FC<BountyProgressProps> = ({
  proposal,
  bounty,
}) => {
  function renderLink(
    status: 'pending' | 'completed',
    total?: number,
    completed?: number
  ) {
    if (total === undefined && completed === undefined) {
      return (
        <div
          className={cn(styles.link, {
            [styles.pending]: status === 'pending',
            [styles.completed]: status === 'completed',
          })}
        />
      );
    }

    if (total !== undefined && completed !== undefined) {
      const completedPercent = (completed * 100) / total;

      return (
        <div
          className={cn(
            styles.link,
            {
              [styles.pending]: status === 'pending',
              [styles.completed]: status === 'completed',
            },
            styles.progress
          )}
        >
          {completed > 0 && (
            <div
              className={styles.completedProgress}
              style={{ width: `${completedPercent}%` }}
            />
          )}
        </div>
      );
    }

    return null;
  }

  function renderNode(
    label: string,
    status: 'pending' | 'completed',
    addLink?: boolean,
    totalClaims?: number,
    completedClaims?: number
  ) {
    return (
      <>
        {addLink && renderLink(status, totalClaims, completedClaims)}
        <div
          className={cn(styles.node, {
            [styles.pending]: status === 'pending',
            [styles.completed]: status === 'completed',
          })}
        >
          {status === 'completed' && (
            <Icon name="statusSuccess" className={styles.icon} />
          )}
          {label && <div className={styles.nodeLabel}>{label}</div>}
        </div>
      </>
    );
  }

  const proposalPhase =
    proposal?.status === 'Approved' || proposal?.status === 'InProgress'
      ? 'completed'
      : 'pending';
  const bountyPhase = bounty ? 'completed' : 'pending';
  const completedPhase = Number(bounty?.times) === 0 ? 'completed' : 'pending';
  const inProgressPhase =
    bounty?.bountyClaims.length || completedPhase === 'completed'
      ? 'completed'
      : 'pending';

  const kind = proposal.kind as {
    type: ProposalType.AddBounty;
    bounty: AddBountyRequest;
  };

  const proposedBounty = kind.bounty;
  const totalClaims = proposedBounty.times;
  const completedClaims =
    bounty?.bountyDoneProposals.filter(item => item.status === 'Approved')
      .length ?? 0;

  return (
    <div className={styles.root}>
      {renderNode('Proposal Phase', proposalPhase)}
      {renderNode('Available Bounty', bountyPhase, true)}
      {renderNode('In progress', inProgressPhase, true)}
      {renderNode(
        'Completed',
        completedPhase,
        true,
        totalClaims,
        completedClaims
      )}
    </div>
  );
};
