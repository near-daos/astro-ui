import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import { ProposalStatus, ProposalType } from 'types/proposal';

import styles from './proposal-status.module.scss';

interface ProposalStatusProps {
  status: ProposalStatus;
  type: ProposalType;
}

function getIconName(type: ProposalType) {
  switch (type) {
    case 'AddMemberToRole':
      return 'proposalAddMember';
    // case 'Remove member':
    //   return 'proposalRemoveMember';
    // case 'Bounty done':
    //   return 'proposalBounty';
    // case 'Create group':
    //   return 'proposalCreateGroup';
    case 'Transfer':
      return 'proposalSendFunds';
    // case 'Poll':
    //   return 'proposalPoll';
    // case 'Create bounty':
    //   return 'proposalBounty';
    case 'ChangePolicy':
      return 'proposalGovernance';
    default:
    case 'FunctionCall':
      return 'proposalNearFunctionCall';
  }
}

function getTitle(type: ProposalType) {
  switch (type) {
    case 'AddMemberToRole':
      return 'Add member to role';
    // case 'Remove member':
    //   return 'proposalRemoveMember';
    // case 'Bounty done':
    //   return 'proposalBounty';
    // case 'Create group':
    //   return 'proposalCreateGroup';
    case 'Transfer':
      return 'Transfer';
    // case 'Poll':
    //   return 'proposalPoll';
    // case 'Create bounty':
    //   return 'proposalBounty';
    case 'ChangePolicy':
      return 'Change policy';
    default:
    case 'FunctionCall':
      return 'Function call';
  }
}

const ProposalStatusPanel: FC<ProposalStatusProps> = ({ status, type }) => {
  const statusClassName = cn({
    [styles.active]: status === 'InProgress',
    [styles.passed]: status === 'Approved',
    [styles.rejected]: status === 'Rejected',
    [styles.dismissed]: status === 'Removed',
    [styles.expired]: status === 'Expired'
  });

  const iconName = getIconName(type);
  const title = getTitle(type);

  return (
    <div className={cn(styles.root, statusClassName)}>
      <Icon name={iconName} className={styles.icon} />
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default ProposalStatusPanel;
