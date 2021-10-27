import React, { FC } from 'react';
import cn from 'classnames';

import { useCountdown } from 'components/cards/expanded-proposal-card/helpers';
import { Icon } from 'components/Icon';
import * as Typography from 'components/Typography';
import { ProposalStatus, ProposalType } from 'types/proposal';

import styles from './status-panel.module.scss';

interface StatusPanelProps {
  status: ProposalStatus;
  type: ProposalType;
  endsAt: string;
  onClose: () => void;
}

function getIconName(type: ProposalType) {
  switch (type) {
    case 'AddMemberToRole':
      return 'proposalAddMember';
    case 'RemoveMemberFromRole':
      return 'proposalRemoveMember';
    case 'BountyDone':
    case 'AddBounty':
      return 'proposalBounty';
    // case 'Create group':
    //   return 'proposalCreateGroup';
    case 'Transfer':
      return 'proposalSendFunds';
    case 'Vote':
      return 'proposalPoll';
    case 'ChangePolicy':
      return 'proposalGovernance';
    default:
    case 'FunctionCall':
      return 'proposalNearFunctionCall';
  }
}

export const StatusPanel: FC<StatusPanelProps> = ({
  status,
  type,
  endsAt,
  onClose,
}) => {
  const statusClassName = cn({
    [styles.active]: status === 'InProgress',
    [styles.passed]: status === 'Approved',
    [styles.rejected]: status === 'Rejected',
    [styles.dismissed]: status === 'Removed',
    [styles.expired]: status === 'Expired',
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
        {timeLeft && status === 'InProgress'
          ? `Voting ends in ${timeLeft}`
          : 'Voting ended'}
      </span>
      <Icon
        name="buttonAdd"
        className={cn(styles.icon, styles.close)}
        onClick={onClose}
      />
    </div>
  );
};
