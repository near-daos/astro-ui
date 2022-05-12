import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';
import { ProposalAction } from 'types/role';

import styles from './VoteAction.module.scss';

export type VoteActionProps = {
  className?: string;
  type: ProposalAction;
  position: string;
  date: string;
  name: string;
};

export const VoteAction: FC<VoteActionProps> = ({
  className,
  type,
  position = '0',
  date,
  name,
}) => (
  <div
    style={{ left: position }}
    className={cn(
      styles.voteAction,
      {
        [styles.failure]: type === 'VoteReject',
        [styles.approve]: type === 'VoteApprove',
      },
      className
    )}
  >
    <Tooltip
      popupClassName={styles.tooltip}
      overlay={
        <>
          {name}
          <br /> {date}
        </>
      }
    >
      <Icon name={type === 'VoteApprove' ? 'votingYes' : 'votingNo'} />
    </Tooltip>
  </div>
);
