import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';
import { ProposalActionData } from 'types/proposal';
import { formatTimestampAsDate } from 'utils/format';

import styles from './ExtraActions.module.scss';

export type ExtraActionsProps = {
  className?: string;
  actions: ProposalActionData[];
};

export const ExtraActions: FC<ExtraActionsProps> = ({ className, actions }) => {
  if (!actions.length) {
    return null;
  }

  return (
    <div className={cn(styles.extraVotes, className)}>
      <Tooltip
        popupClassName={styles.tooltip}
        overlay={
          <ul className={styles.list}>
            {actions.map(action => (
              <li key={action.id} className={styles.item}>
                <Icon
                  name={
                    action.action === 'VoteApprove' ? 'votingYes' : 'votingNo'
                  }
                  className={styles.icon}
                />
                <div className={styles.name}>{action.accountId}</div>
                <div className={styles.date}>
                  {formatTimestampAsDate(action.timestamp)}
                </div>
              </li>
            ))}
          </ul>
        }
      >
        <div className={styles.number}>{actions.length}</div>
      </Tooltip>
    </div>
  );
};
