import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { ProposalStatus } from 'types/proposal';

import styles from './FinishProposal.module.scss';

interface FinishProposalProps {
  className?: string;
  status: ProposalStatus;
}

export const FinishProposal: FC<FinishProposalProps> = ({
  className,
  status = 'Active',
}) => (
  <div
    className={cn(
      styles.finishProposal,
      {
        [styles.approved]: status === 'Approved',
        [styles.rejected]: status === 'Rejected' || status === 'Failed',
        [styles.expired]: status === 'Expired',
      },
      className
    )}
  >
    {status !== 'Active' ? (
      <>
        <Icon
          name={status === 'Approved' ? 'statusSuccess' : 'clock'}
          className={styles.icon}
        />
        <div className={styles.text}>
          {status === 'InProgress' ? '' : status}{' '}
        </div>
      </>
    ) : null}
  </div>
);
