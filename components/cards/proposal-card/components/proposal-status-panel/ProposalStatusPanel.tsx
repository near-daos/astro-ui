import React, { FC } from 'react';
import cn from 'classnames';
import {
  // ProposalStatus,
  // ProposalType,
  ProposalVariant
} from 'components/cards/proposal-card/types';
import { Icon } from 'components/Icon';
import { ProposalStatus, ProposalType } from 'types/proposal';

import styles from './proposal-status.module.scss';

interface ProposalStatusProps {
  status: ProposalStatus;
  type: ProposalType;
  variant: ProposalVariant;
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

const ProposalStatusPanel: FC<ProposalStatusProps> = ({
  status,
  type,
  variant
}) => {
  const statusClassName = cn({
    [styles.active]: status === 'InProgress',
    [styles.passed]: status === 'Approved',
    [styles.rejected]: status === 'Rejected',
    [styles.dismissed]: status === 'Removed',
    [styles.expired]: status === 'Expired'
  });

  const iconName = getIconName(type);

  return (
    <div className={cn(styles.root, statusClassName)}>
      <Icon name={iconName} className={styles.icon} />
      {variant === 'SuperCollapsed' && (
        <span className={styles.title}>Poll</span>
      )}
    </div>
  );
};

export default ProposalStatusPanel;
