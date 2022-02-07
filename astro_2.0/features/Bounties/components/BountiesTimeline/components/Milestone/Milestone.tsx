import React, { FC } from 'react';
import cn from 'classnames';
import { TimelineMilestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { Icon, IconName } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';

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
      icon = 'bountyCompleteBounty';

      if (color) {
        iconColor = color;
      }

      break;
    }
    case 'Claim Deadline': {
      icon = 'bountyDeadlineClaim';

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
        <Tooltip
          placement="right"
          popupClassName={styles.popupWrapper}
          overlay={<div className={styles.tooltip}>{data.tooltip}</div>}
        >
          <Icon
            name={icon}
            className={cn(styles.icon, {
              [styles.rootIcon]: !color,
            })}
            style={{ color: iconColor }}
          />
        </Tooltip>
      )}
    </div>
  );
};
