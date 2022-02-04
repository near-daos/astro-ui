import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';

import { Bounty, BountyProposal } from 'types/bounties';

import styles from './BountyProgress.module.scss';

interface BountyProgressProps {
  proposal: BountyProposal;
  bounty: Bounty;
}

export const BountyProgress: FC<BountyProgressProps> = ({
  proposal,
  bounty,
}) => {
  function renderNode(
    label: string,
    status: 'pending' | 'completed',
    addLink?: boolean
  ) {
    return (
      <>
        {addLink && (
          <div
            className={cn(styles.link, {
              [styles.pending]: status === 'pending',
              [styles.completed]: status === 'completed',
            })}
          />
        )}
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
    proposal?.status === 'Approved' ? 'completed' : 'pending';
  const bountyPhase = bounty ? 'completed' : 'pending';
  const completedPhase = Number(bounty.times) === 0 ? 'completed' : 'pending';
  const inProgressPhase =
    bounty.bountyClaims.length || completedPhase === 'completed'
      ? 'completed'
      : 'pending';

  return (
    <div className={styles.root}>
      {renderNode('Proposal Phase', proposalPhase)}
      {renderNode('Available Bounty', bountyPhase, true)}
      {renderNode('In progress', inProgressPhase, true)}
      {renderNode('Completed', completedPhase, true)}
    </div>
  );
};
