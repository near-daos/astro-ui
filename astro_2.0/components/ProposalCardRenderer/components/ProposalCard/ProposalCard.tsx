import React, { ReactNode, useCallback } from 'react';

import { ProposalStatus, ProposalType, VoteAction } from 'types/proposal';
import { ExplorerLink } from 'components/explorer-link';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';
import { ProgressBar } from 'components/vote-details/components/progress-bar/ProgressBar';
import { VoteDetail } from 'features/types';
import { ProposalActions } from 'features/proposal/components/proposal-actions';
import { DAO } from 'types/dao';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { Icon, IconName } from 'components/Icon';
import { useGetVotePermissions } from 'components/cards/proposal-card/hooks/useGetVotePermissions';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { SputnikNearService } from 'services/sputnik';
import styles from './ProposalCard.module.scss';

export interface ProposalCardProps {
  type: ProposalType;
  status: ProposalStatus;
  proposer: string;
  description: string;
  link: string;
  proposalTxHash: string;
  dao: DAO;
  proposalId: number;
  accountId: string;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  voteDetails?: VoteDetail;
  content: ReactNode;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  type,
  proposalTxHash,
  proposer,
  description,
  link,
  status,
  proposalId,
  likes,
  dislikes,
  liked,
  disliked,
  voteDetails,
  content,
  accountId,
  dao,
}) => {
  const permissions = useGetVotePermissions(dao, type, accountId);

  let sealIcon;

  const voteClickHandler = useCallback(
    (vote: VoteAction) => () => {
      SputnikNearService.vote(dao.id, proposalId, vote);
    },
    [dao, proposalId]
  );

  switch (status) {
    case 'Approved': {
      sealIcon = 'sealApproved';
      break;
    }
    case 'Expired':
    case 'Moved':
    case 'Rejected':
    case 'Removed': {
      sealIcon = 'sealFailed';
      break;
    }
    case 'InProgress':
    default: {
      sealIcon = null;
    }
  }

  return (
    <div className={styles.root}>
      {sealIcon && (
        <div className={styles.proposalStatusSeal}>
          <Icon name={sealIcon as IconName} />
        </div>
      )}
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          label="Proposal type"
          valueFontSize="L"
          value={
            <div className={styles.proposalType}>
              {type}
              <ExplorerLink
                linkData={proposalTxHash}
                linkType="transaction"
                className={styles.proposalWalletLink}
              />
            </div>
          }
        />
      </div>
      <div className={styles.countdownCell}>44 min left</div>
      <div className={styles.proposerCell}>
        <InfoBlockWidget label="Proposer" value={proposer} />
      </div>
      <div className={styles.descriptionCell}>
        <div className={styles.label}>Description</div>
        <div className={styles.proposalDescription}>{description}</div>
        <div className={styles.proposalExternalLink}>
          <ExternalLink to={link} />
        </div>
      </div>
      <div className={styles.contentCell}>{content}</div>
      <div className={styles.voteControlCell}>
        <ProposalControlPanel
          status={status}
          onLike={voteClickHandler('VoteApprove')}
          onDislike={voteClickHandler('VoteReject')}
          likes={likes}
          liked={liked}
          dislikes={dislikes}
          disliked={disliked}
          permissions={permissions}
        />
      </div>
      <div className={styles.voteProgress}>
        {voteDetails && <ProgressBar detail={voteDetails} />}
      </div>
      <div className={styles.actionBar}>
        <ProposalActions />
      </div>
    </div>
  );
};
