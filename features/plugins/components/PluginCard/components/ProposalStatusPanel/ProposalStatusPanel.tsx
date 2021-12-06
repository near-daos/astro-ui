import cn from 'classnames';
import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import { ProposalStatus, ProposalType } from 'types/proposal';

import styles from './ProposalStatusPanel.module.scss';

interface ProposalStatusProps {
  status: ProposalStatus;
  type: ProposalType;
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

function getTitle(type: ProposalType) {
  switch (type) {
    case 'AddMemberToRole':
      return 'Add member to role';
    case 'RemoveMemberFromRole':
      return 'proposalRemoveMember';
    case 'BountyDone':
    case 'AddBounty':
      return 'proposalBounty';
    // case 'Create group':
    //   return 'proposalCreateGroup';
    case 'Transfer':
      return 'Transfer';
    case 'Vote':
      return 'proposalPoll';
    case 'ChangePolicy':
      return 'Change policy';
    default:
    case 'FunctionCall':
      return 'Function call';
  }
}

export const ProposalStatusPanel: FC<ProposalStatusProps> = ({
  status,
  type,
}) => {
  const statusClassName = cn({
    [styles.inProgress]: status === 'InProgress',
    [styles.approved]: status === 'Approved',
    [styles.rejected]: status === 'Rejected',
    [styles.expired]: status === 'Expired',
    [styles.removed]: status === 'Removed',
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
