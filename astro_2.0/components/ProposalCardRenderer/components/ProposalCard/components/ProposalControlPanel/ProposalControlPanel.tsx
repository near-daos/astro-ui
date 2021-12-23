import cn from 'classnames';
import React, { FC } from 'react';
import { ProposalStatus, ProposalVotingPermissions } from 'types/proposal';
import { kFormatter } from 'helpers/format';
import { ProposalControlButton } from './components/ProposalControlButton';

import styles from './ProposalControlPanel.module.scss';

interface ProposalControlPanelProps {
  likes: number;
  liked: boolean;
  dislikes: number;
  disliked: boolean;
  dismisses?: number;
  dismissed?: boolean;
  permissions: ProposalVotingPermissions;
  onLike?: React.MouseEventHandler<HTMLButtonElement>;
  onDislike?: React.MouseEventHandler<HTMLButtonElement>;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  disableControls?: boolean;
  className?: string;
  status?: ProposalStatus;
  toggleInfoPanel?: React.MouseEventHandler<HTMLButtonElement>;
  commentsCount: number;
}

export const ProposalControlPanel: FC<ProposalControlPanelProps> = ({
  status,
  likes,
  liked,
  dislikes,
  disliked,
  dismissed,
  onLike,
  onDislike,
  permissions,
  className = '',
  disableControls,
  toggleInfoPanel,
  commentsCount,
}) => {
  const { canApprove, canReject } = permissions;
  const voted =
    liked || disliked || dismissed || (status && status !== 'InProgress');

  const yesIconName = canApprove ? 'votingYes' : 'votingYesDisabled';
  const noIconName = canReject ? 'votingNo' : 'votingNoDisabled';

  return (
    <div className={cn(styles.root, className)}>
      <ProposalControlButton
        icon={liked ? 'votingYesChecked' : yesIconName}
        voted={voted}
        times={likes}
        onClick={onLike}
        disabled={Boolean(!canApprove || disableControls)}
      />
      <ProposalControlButton
        icon={disliked ? 'votingNoChecked' : noIconName}
        voted={voted}
        times={dislikes}
        onClick={onDislike}
        disabled={Boolean(!canReject || disableControls)}
      />
      <ProposalControlButton
        icon="chat"
        iconClassName={styles.toggleCommentsButton}
        voted={false}
        times={kFormatter(commentsCount)}
        onClick={toggleInfoPanel}
        disabled={false}
      />
    </div>
  );
};
