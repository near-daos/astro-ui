import React, { FC } from 'react';
import cn from 'classnames';
import {
  ProposalStatus,
  ProposalType
} from 'components/cards/proposal-card/types';
import { useCountdown } from 'components/cards/expanded-proposal-card/helpers';
import { Icon } from 'components/Icon';
import * as Typography from 'components/Typography';

import styles from './status-panel.module.scss';

interface StatusPanelProps {
  status: ProposalStatus;
  type: ProposalType;
  endsAt: string;
}

function getIconName(type: ProposalType) {
  switch (type) {
    case 'Add member':
      return 'proposalAddMember';
    case 'Remove member':
      return 'proposalRemoveMember';
    case 'Bounty done':
      return 'proposalBounty';
    case 'Create group':
      return 'proposalCreateGroup';
    case 'Request payout':
      return 'proposalSendFunds';
    case 'Poll':
      return 'proposalPoll';
    case 'Create bounty':
      return 'proposalBounty';
    case 'Change DAO settings':
      return 'proposalGovernance';
    default:
    case 'Call NEAR function':
      return 'proposalNearFunctionCall';
  }
}

export const StatusPanel: FC<StatusPanelProps> = ({ status, type, endsAt }) => {
  const statusClassName = cn({
    [styles.active]: status === 'Voting in progress',
    [styles.passed]: status === 'Passed',
    [styles.rejected]: status === 'Rejected',
    [styles.dismissed]: status === 'Dismissed as spam',
    [styles.expired]: status === 'Expired'
  });

  const iconName = getIconName(type);

  const timeLeft = useCountdown(endsAt);

  return (
    <div className={cn(styles.root, statusClassName)}>
      <Icon name={iconName} className={styles.icon} />
      <Typography.Title size={5} className={styles.type}>
        {type}
      </Typography.Title>
      <span className={styles.vote}>
        {timeLeft ? `Voting ends in ${timeLeft}` : 'Voting ended'}
      </span>
      <Icon name="buttonAdd" className={cn(styles.icon, styles.close)} />
    </div>
  );
};
