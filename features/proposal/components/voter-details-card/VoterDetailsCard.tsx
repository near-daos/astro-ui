import React, { FC } from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';

import { Icon, IconName } from 'components/Icon';
import { Badge } from 'components/badge/Badge';
import { ExplorerLink } from 'components/ExplorerLink';
import { Vote } from 'features/types';
import { getBadgeVariant } from 'features/proposal/helpers';
import { formatTimestampAsDate } from 'utils/format';

import styles from './voter-details-card.module.scss';

const GroupsRenderer = dynamic(
  import('components/cards/member-card/GroupsRenderer'),
  {
    ssr: false,
  }
);

interface VoterDetailsCardProps {
  vote: Vote | null;
  name: string;
  groups?: string[];
  transactionHash: string | undefined;
  timestamp: string | null | undefined;
}

export const VoterDetailsCard: FC<VoterDetailsCardProps> = ({
  vote,
  name,
  groups,
  transactionHash,
  timestamp,
}) => {
  let icon;

  switch (vote) {
    case 'Yes': {
      icon = 'votingYes';
      break;
    }
    case 'No': {
      icon = 'votingNo';
      break;
    }
    default: {
      icon = 'buttonMore';
    }
  }

  const selectedItems = groups?.map(n => ({
    label: n,
    component: (
      <Badge size="small" variant={getBadgeVariant(n)}>
        {n}
      </Badge>
    ),
  }));

  return (
    <div className={styles.root}>
      <div
        className={cn(styles.status, {
          [styles.yes]: vote === 'Yes',
          [styles.no]: vote === 'No',
          [styles.notVoted]: vote === null,
        })}
      >
        <Icon
          width={24}
          name={icon as IconName}
          className={cn({
            [styles.rotate]: vote === null,
          })}
        />
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.groups}>
        <GroupsRenderer selectedItems={selectedItems ?? []} />
      </div>
      <div className={styles.other}>
        &nbsp;
        {timestamp ? formatTimestampAsDate(timestamp) : null}
      </div>
      <div className={styles.link}>
        {vote && (
          <ExplorerLink
            linkData={transactionHash ?? ''}
            linkType="transaction"
            isAbsolute
            className={styles.linkItem}
          />
        )}
      </div>
    </div>
  );
};
