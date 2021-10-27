import cn from 'classnames';
import React, { FC } from 'react';
import { ProposalStatus, ProposalVotingPermissions } from 'types/proposal';

import ProposalControlButton from './components/proposal-control-button';

import styles from './proposal-control-panel.module.scss';

interface ProposalControlPanelProps {
  likes: number;
  liked: boolean;
  dislikes: number;
  disliked: boolean;
  dismisses: number;
  dismissed: boolean;
  permissions: ProposalVotingPermissions;
  onLike?: (e?: Partial<Event>) => void;
  onDislike?: (e?: Partial<Event>) => void;
  onRemove?: (e?: Partial<Event>) => void;
  className?: string;
  status?: ProposalStatus;
}

const ProposalControlPanel: FC<ProposalControlPanelProps> = ({
  status,
  likes,
  liked,
  dislikes,
  disliked,
  dismisses,
  dismissed,
  onLike,
  onDislike,
  onRemove,
  permissions,
  className = '',
}) => {
  const { canApprove, canReject, canDelete } = permissions;
  const voted =
    liked || disliked || dismissed || (status && status !== 'InProgress');

  return (
    <div className={cn(styles.root, className)}>
      <ProposalControlButton
        icon={(() => {
          if (liked) {
            return 'votingYesChecked';
          }

          return canApprove ? 'votingYes' : 'votingYesDisabled';
        })()}
        voted={voted}
        times={likes}
        onClick={onLike}
        disabled={!canApprove}
      />
      <ProposalControlButton
        icon={(() => {
          if (disliked) {
            return 'votingNoChecked';
          }

          return canReject ? 'votingNo' : 'votingNoDisabled';
        })()}
        voted={voted}
        times={dislikes}
        onClick={onDislike}
        disabled={!canReject}
      />
      <ProposalControlButton
        icon={(() => {
          if (dismissed) {
            return 'votingDismissChecked';
          }

          return canDelete ? 'votingDismiss' : 'votingDismissDisabled';
        })()}
        voted={voted}
        times={dismisses}
        onClick={onRemove}
        disabled={!canDelete}
      />
    </div>
  );
};

export default ProposalControlPanel;
