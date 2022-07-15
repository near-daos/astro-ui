import { ProposalType, ProposalVariant } from 'types/proposal';
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
  proposalVariant?: ProposalVariant;
}

const getIconName = (type: ProposalType, variant?: ProposalVariant) => {
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
    case 'ChangePolicy': {
      switch (variant) {
        case ProposalVariant.ProposeStakingContractDeployment:
        case ProposalVariant.ProposeAcceptStakingContract:
        case ProposalVariant.ProposeStakeTokens:
        case ProposalVariant.ProposeDelegateVoting: {
          return 'tokenWizard';
        }
        default: {
          return 'proposalGovernance';
        }
      }
    }
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
  proposalVariant,
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
          name={getIconName(type, proposalVariant)}
          className={cn(styles.icon, iconClassName)}
        />
      </div>
    </div>
  );
};
