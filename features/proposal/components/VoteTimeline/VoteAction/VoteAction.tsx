import React, { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';

import { configService } from 'services/ConfigService';

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
  hash?: string;
};

export const VoteAction: FC<VoteActionProps> = ({
  className,
  type,
  position = '0',
  date,
  name,
  hash,
}) => {
  const { nearConfig } = configService.get();

  const explorerLink = hash
    ? `${nearConfig?.explorerUrl}/transactions/${hash}`
    : '';

  return (
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
          <span className={styles.tooltipOverlay}>
            {name}
            <br />
            {date}
            <br />
            <span className={styles.sub}>Click to open in Explorer</span>
          </span>
        }
      >
        <Link href={explorerLink}>
          <a rel="noreferrer" target="_blank">
            <Icon name={type === 'VoteApprove' ? 'votingYes' : 'votingNo'} />
          </a>
        </Link>
      </Tooltip>
    </div>
  );
};
