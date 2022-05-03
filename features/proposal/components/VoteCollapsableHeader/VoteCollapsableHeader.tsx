import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { VoterDetail } from 'features/types';
import { VotesProgressBar } from 'features/proposal/components/VoicesProgressBar';
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
  const { t } = useTranslation();
  const voiceCounter = useMemo(
    () => votes.filter(vote => Boolean(vote.vote)).length,
    [votes]
  );

  return (
    <div
      tabIndex={-1}
      role="button"
      className={cn(styles.header, { [styles.open]: state })}
      onClick={() => setToggle(!state)}
      onKeyPress={() => undefined}
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
          {voiceCounter}/{votes.length} {t('proposalVotes.voices')}
        </div>
      </div>

      <div className={styles.rightPart}>
        <VotesProgressBar votes={votes} className={styles.progressBar} />
        <IconButton
          icon="buttonArrowDown"
          iconProps={{
            className: cn(styles.controlIcon, {
              [styles.open]: state,
            }),
          }}
        />
      </div>
    </div>
  );
};
