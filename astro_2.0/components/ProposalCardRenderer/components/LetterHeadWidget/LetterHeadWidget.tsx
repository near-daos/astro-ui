import { ProposalType } from 'types/proposal';
import cn from 'classnames';

import React from 'react';

import { Icon } from 'components/Icon';

import styles from './LetterheadWidget.module.scss';

interface LetterHeadWidgetProps {
  type: ProposalType;
  coverUrl?: string;
  status?: string;
  className?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
  backgroundClassName?: string;
}

const getIconName = (type: ProposalType) => {
  switch (type) {
    case 'AddMemberToRole':
      return 'proposalAddMember';
    case 'RemoveMemberFromRole':
      return 'proposalRemoveMember';
    case 'BountyDone':
    case 'AddBounty':
      return 'proposalBounty';
    case 'Transfer':
      return 'proposalSendFunds';
    case 'Vote':
      return 'proposalPoll';
    case 'ChangePolicy':
      return 'proposalGovernance';
    case 'FunctionCall':
      return 'proposalFunctionCall';
    default:
      return 'proposalFunctionCall';
  }
};

export const LetterHeadWidget: React.FC<LetterHeadWidgetProps> = ({
  type,
  coverUrl,
  status,
  className,
  iconWrapperClassName,
  iconClassName,
  backgroundClassName,
}) => {
  return (
    <div
      className={cn(
        styles.root,
        {
          [styles.active]: status === 'InProgress',
          [styles.approved]: status === 'Approved',
          [styles.rejected]: status === 'Rejected',
        },
        className
      )}
      style={{
        backgroundImage: `url(${coverUrl || '/flags/defaultDaoFlag.png'})`,
      }}
    >
      <div className={cn(styles.background, backgroundClassName)} />
      <div className={cn(styles.iconHolder, iconWrapperClassName)}>
        <Icon
          name={getIconName(type)}
          className={cn(styles.icon, iconClassName)}
        />
      </div>
    </div>
  );
};
