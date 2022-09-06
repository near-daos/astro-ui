import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';
import { ExplorerLink } from 'components/ExplorerLink';
import { Vote } from 'features/types';
import { formatTimestampAsDate } from 'utils/format';

import { Token as TokenDetails } from 'components/cards/member-card/types';

import styles from './VoterDetailsCard.module.scss';

interface VoterDetailsCardProps {
  vote: Vote | null;
  name: string;
  groups?: string[];
  transactionHash: string | undefined;
  timestamp: string | null | undefined;
  tokensDetails?: TokenDetails | null;
  isLastVote: boolean;
}

export const VoterDetailsCard: FC<VoterDetailsCardProps> = ({
  vote,
  name,
  transactionHash,
  timestamp,
  tokensDetails,
  isLastVote,
}) => {
  let icon;
  let iconSize = 40;

  switch (vote) {
    case 'Yes': {
      icon = 'votingYes';
      break;
    }
    case 'No': {
      icon = 'votingNo';
      break;
    }
    case 'Dismiss': {
      icon = 'votingDismissAlt';
      iconSize = 24;
      break;
    }
    default: {
      iconSize = 32;
      icon = 'notVoted';
    }
  }

  return (
    <div className={styles.root}>
      <div
        className={cn(styles.status, {
          [styles.yes]: vote === 'Yes',
          [styles.no]: vote === 'No',
          [styles.dismiss]: vote === 'Dismiss',
          [styles.notVoted]: vote === null,
        })}
      >
        <Icon width={iconSize} name={icon as IconName} />
        {isLastVote && (
          <Icon name="buttonCheck" className={styles.lastVoteIcon} />
        )}
      </div>
      <div className={styles.name}>{name}</div>
      {tokensDetails && (
        <div className={styles.tokensDetails}>
          <span className={styles.primaryValue}>{tokensDetails.value}</span>
          <span className={styles.secondaryValue}>{tokensDetails.symbol}</span>
        </div>
      )}
      <div className={styles.other}>
        &nbsp;
        {timestamp ? formatTimestampAsDate(timestamp) : null}
      </div>
      <div className={styles.link}>
        {vote && (
          <ExplorerLink
            linkData={transactionHash ?? ''}
            linkType="transaction"
            className={styles.linkItem}
          />
        )}
      </div>
    </div>
  );
};
