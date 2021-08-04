import React, { FC } from 'react';
import cn from 'classnames';

import {
  VotingNo,
  VotingNoChecked,
  VotingYes,
  VotingYesChecked
} from 'components/cards/proposal-card/components/proposal-control-panel/icons';
import { IconButton } from 'components/button/IconButton';

import styles from './proposal-control-panel.module.scss';

interface ProposalControlPanelProps {
  likes: number;
  liked: boolean;
  dislikes: number;
  disliked: boolean;
  onLike: () => void;
  onDislike: () => void;
}

const ProposalControlPanel: FC<ProposalControlPanelProps> = ({
  likes,
  liked,
  dislikes,
  disliked,
  onLike,
  onDislike
}) => {
  return (
    <div className={styles.root}>
      <span className={styles.item}>
        <IconButton className={styles.icon} size="large" onClick={onLike}>
          {liked ? <VotingYesChecked /> : <VotingYes />}
        </IconButton>
        <span className={cn(styles.value, 'title3')}>{likes}</span>
      </span>
      <span className={styles.item}>
        <IconButton className={styles.icon} size="large" onClick={onDislike}>
          {disliked ? <VotingNoChecked /> : <VotingNo />}
        </IconButton>
        <span className={cn(styles.value, 'title3')}>{dislikes}</span>
      </span>
    </div>
  );
};

export default ProposalControlPanel;
