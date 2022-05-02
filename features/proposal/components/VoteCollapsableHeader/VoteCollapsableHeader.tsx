import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import { VoterDetail } from 'features/types';
import { VoicesProgressBar } from 'features/proposal/components/VoicesProgressBar';
import { Badge, getBadgeVariant } from 'components/Badge';
import { IconButton } from 'components/button/IconButton';

import styles from './VoteCollapsableHeader.module.scss';

interface VoteCollapsableHeaderProps {
  setToggle: (newState?: boolean) => void;
  state: boolean;
  votes: VoterDetail[];
  groupName: string;
}

export const VoteCollapsableHeader: FC<VoteCollapsableHeaderProps> = ({
  setToggle,
  state,
  votes,
  groupName,
}) => {
  const voiceCounter = useMemo(
    () => votes.filter(vote => Boolean(vote.vote)).length,
    [votes]
  );

  return (
    <button
      type="button"
      className={cn(styles.header, { [styles.open]: state })}
      onClick={() => setToggle(!state)}
    >
      <div className={styles.leftPart}>
        <Badge
          size="small"
          variant={getBadgeVariant(groupName)}
          className={styles.badge}
        >
          {groupName}
        </Badge>
        <div className={styles.separator} />
        <div className={styles.voicesCounter}>
          {voiceCounter}/{votes.length} voices
        </div>
      </div>

      <div className={styles.rightPart}>
        <VoicesProgressBar votes={votes} className={styles.progressBar} />
        <IconButton
          icon="buttonArrowDown"
          iconProps={{
            className: cn(styles.controlIcon, {
              [styles.open]: state,
            }),
          }}
        />
      </div>
    </button>
  );
};
