import React, { FC } from 'react';
import cn from 'classnames';
import {
  ProposalStatus,
  ProposalType
} from 'components/cards/proposal-card/types';
import { Icon } from 'components/Icon';

import styles from './proposal-status.module.scss';

interface ProposalStatusProps {
  status: ProposalStatus;
  type: ProposalType;
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

const ProposalStatusPanel: FC<ProposalStatusProps> = ({ status, type }) => {
  const statusClassName = cn({
    [styles.active]: status === 'Voting in progress',
    [styles.passed]: status === 'Passed',
    [styles.rejected]: status === 'Rejected',
    [styles.dismissed]: status === 'Dismissed as spam',
    [styles.expired]: status === 'Expired'
  });

  const iconName = getIconName(type);

  return (
    <div className={cn(styles.root, statusClassName)}>
      <Icon name={iconName} className={styles.icon} />
    </div>
  );
};

export default ProposalStatusPanel;
