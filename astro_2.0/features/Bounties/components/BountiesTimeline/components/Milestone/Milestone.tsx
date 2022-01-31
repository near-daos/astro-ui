import React, { FC } from 'react';
import cn from 'classnames';
import { TimelineMilestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { Icon, IconName } from 'components/Icon';

import styles from './Milestone.module.scss';

interface MilestoneProps {
  data: TimelineMilestone;
  color?: string;
  className?: string;
}

export const Milestone: FC<MilestoneProps> = ({
  data,
  color,
  className = '',
}) => {
  let icon: IconName | null;
  let iconColor = '#000';

  switch (data.type) {
    case 'Proposal Created': {
      icon = 'bountyProposalCreated';
      break;
    }
    case 'Bounty Created': {
      icon = 'bountyCreated';
      break;
    }
    case 'Claim': {
      icon = 'bountyCreateClaim';

      if (color) {
        iconColor = color;
      }

      break;
    }
    case 'Complete Claim': {
      icon = 'bountyApprovedClaim';

      if (color) {
        iconColor = color;
      }

      break;
    }
    case 'Pending Approval': {
      icon = 'bountyPendingApproval';

      if (color) {
        iconColor = color;
      }

      break;
    }
    case 'Complete Bounty': {
      icon = 'bountyCompleteBounty';
      break;
    }
    default: {
      icon = null;
    }
  }

  return (
    <div className={cn(styles.root, className)}>
      {icon && (
        <Icon
          name={icon}
          className={styles.icon}
          style={{ color: iconColor }}
        />
      )}
    </div>
  );
};
