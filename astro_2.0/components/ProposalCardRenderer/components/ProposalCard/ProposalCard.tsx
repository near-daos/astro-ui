import React from 'react';

import {
  ProposalStatus,
  ProposalType,
  ProposalVotingPermissions,
  VoteAction,
} from 'types/proposal';
import { ExplorerLink } from 'components/explorer-link';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';
import { ProgressBar } from 'components/vote-details/components/progress-bar/ProgressBar';
import { VoteDetail } from 'features/types';
import { ProposalActions } from 'features/proposal/components/proposal-actions';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { Icon } from 'components/Icon';

import styles from './ProposalCard.module.scss';

export interface ProposalCardProps {
  type: ProposalType;
  status: ProposalStatus;
  proposer: string;
  description: string;
  link: string;
  onVoteClick: (action: VoteAction) => () => void;
  proposalTxHash: string;
  expireTime: string;
  permissions: ProposalVotingPermissions;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  voteDetails: VoteDetail;
}
export const ProposalCard: React.FC<ProposalCardProps> = ({
  type,
  proposalTxHash,
  proposer,
  description,
  link,
  status,
  onVoteClick,
  permissions,
  likes,
  dislikes,
  liked,
  disliked,
  voteDetails,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.proposalStatusSeal}>
        <Icon name={status === 'Approved' ? 'sealApproved' : 'sealFailed'} />
      </div>
      <div className={styles.proposalCell}>
        <div className={styles.label}>Proposal type</div>
        <div className={styles.proposalTypeAndLink}>
          <div className={styles.proposalValue}>{type}</div>
          <ExplorerLink
            linkData={proposalTxHash}
            linkType="transaction"
            className={styles.proposalWalletLink}
          />
        </div>
      </div>
      <div className={styles.countdownCell}>44 min left</div>
      <div className={styles.proposerCell}>
        <div className={styles.label}>Proposer</div>
        <div className={styles.text}>{proposer}</div>
      </div>
      <div className={styles.descriptionCell}>
        <div className={styles.label}>Description</div>
        <div className={styles.proposalDescription}>{description}</div>
        <div className={styles.proposalExternalLink}>
          <ExternalLink to={link} />
        </div>
      </div>
      <div className={styles.voteControlCell}>
        <ProposalControlPanel
          status={status}
          onLike={onVoteClick('VoteApprove')}
          onDislike={onVoteClick('VoteReject')}
          likes={likes}
          liked={liked}
          dislikes={dislikes}
          disliked={disliked}
          permissions={permissions}
        />
      </div>
      <div className={styles.voteProgress}>
        <ProgressBar detail={voteDetails} />
      </div>
      <div className={styles.actionBar}>
        <ProposalActions />
      </div>
    </div>
  );
};
