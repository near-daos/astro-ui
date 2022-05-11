import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';

import styles from './VoteAction.module.scss';

export type VoteActionProps = {
  className?: string;
  type: 'failure' | 'approved';
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
        [styles.failure]: type === 'failure',
        [styles.approve]: type === 'approved',
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
      <Icon name={type === 'approved' ? 'votingYes' : 'votingNo'} />
    </Tooltip>
  </div>
);
