import cn from 'classnames';
import { IconButton } from 'components/button/IconButton';
import React, { FC } from 'react';
import { ProposalStatus } from 'types/proposal';

import styles from './proposal-control-panel.module.scss';

interface ProposalControlPanelProps {
  likes: number;
  liked: boolean;
  dislikes: number;
  disliked: boolean;
  dismisses: number;
  dismissed: boolean;
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
  className = ''
}) => {
  const voted =
    liked || disliked || dismissed || (status && status !== 'InProgress');

  return (
    <div className={cn(styles.root, className)}>
      <span className={styles.item}>
        <IconButton
          icon={liked ? 'votingYesChecked' : 'votingYes'}
          className={cn(styles.icon, {
            [styles.voted]: voted
          })}
          size="large"
          onClick={!voted ? onLike : undefined}
        />
        <span className={cn(styles.value, 'title3')}>{likes}</span>
      </span>
      <span className={styles.item}>
        <IconButton
          icon={disliked ? 'votingNoChecked' : 'votingNo'}
          className={cn(styles.icon, {
            [styles.voted]: voted
          })}
          size="large"
          onClick={!voted ? onDislike : undefined}
        />
        <span className={cn(styles.value, 'title3')}>{dislikes}</span>
      </span>
      <span className={styles.item}>
        <IconButton
          icon={dismissed ? 'votingDismissChecked' : 'votingDismiss'}
          className={cn(styles.icon, {
            [styles.voted]: voted
          })}
          size="large"
          onClick={!voted ? onRemove : undefined}
        />
        <span className={cn(styles.value, 'title3')}>{dismisses}</span>
      </span>
    </div>
  );
};

export default ProposalControlPanel;
