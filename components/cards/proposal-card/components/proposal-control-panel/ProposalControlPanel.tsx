import cn from 'classnames';
import { IconButton } from 'components/button/IconButton';
import React, { FC } from 'react';

import styles from './proposal-control-panel.module.scss';

interface ProposalControlPanelProps {
  likes: number;
  liked: boolean;
  dislikes: number;
  disliked: boolean;
  onLike: () => void;
  onDislike: () => void;
  className?: string;
}

const ProposalControlPanel: FC<ProposalControlPanelProps> = ({
  likes,
  liked,
  dislikes,
  disliked,
  onLike,
  onDislike,
  className = ''
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <span className={styles.item}>
        <IconButton
          icon={liked ? 'votingYesChecked' : 'votingYes'}
          className={styles.icon}
          size="large"
          onClick={onLike}
        />
        <span className={cn(styles.value, 'title3')}>{likes}</span>
      </span>
      <span className={styles.item}>
        <IconButton
          icon={disliked ? 'votingNoChecked' : 'votingNo'}
          className={styles.icon}
          size="large"
          onClick={onDislike}
        />
        <span className={cn(styles.value, 'title3')}>{dislikes}</span>
      </span>
    </div>
  );
};

export default ProposalControlPanel;
