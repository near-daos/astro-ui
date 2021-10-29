import { ProposalType } from 'types/proposal';

import React from 'react';

import { Icon } from 'components/Icon';

import styles from './LetterheadWidget.module.scss';

interface LetterHeadWidgetProps {
  type: ProposalType;
  coverUrl: string;
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
};

export const LetterHeadWidget: React.FC<LetterHeadWidgetProps> = ({
  type,
  coverUrl,
}) => {
  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: `url(${coverUrl})`,
      }}
    >
      <div className={styles.background} />
      <div className={styles.iconHolder}>
        <Icon name={getIconName(type)} className={styles.icon} />
      </div>
    </div>
  );
};
