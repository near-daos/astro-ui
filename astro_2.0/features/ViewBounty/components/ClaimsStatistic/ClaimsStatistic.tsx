import React, { FC } from 'react';
import cn from 'classnames';

import { ClaimsDonutChart } from 'astro_2.0/features/ViewBounty/components/ClaimsDonutChart';
import { BountyClaim, BountyProposal } from 'types/bounties';

import styles from './ClaimsStatistic.module.scss';

interface ClaimsStatisticProps {
  claims: BountyClaim[];
  doneProposals: BountyProposal[];
}

export const ClaimsStatistic: FC<ClaimsStatisticProps> = ({
  claims,
  doneProposals,
}) => {
  const { pending, inProgress, approved, rejected } = claims.reduce<{
    pending: BountyClaim[];
    inProgress: BountyClaim[];
    approved: BountyClaim[];
    rejected: BountyClaim[];
  }>(
    (res, item) => {
      const proposal = doneProposals.find(
        doneProposal => doneProposal.bountyClaimId === item.id
      );

      if (!proposal) {
        res.inProgress.push(item);
      } else if (proposal.status === 'InProgress') {
        res.pending.push(item);
      } else if (proposal.status === 'Approved') {
        res.approved.push(item);
      } else {
        res.rejected.push(item);
      }

      return res;
    },
    { pending: [], inProgress: [], approved: [], rejected: [] }
  );

  const totalLength =
    approved.length + rejected.length + inProgress.length + pending.length;

  const chartData = [
    {
      status: 'approved',
      value: (approved.length * 100) / totalLength,
    },
    {
      status: 'pending',
      value: (pending.length * 100) / totalLength,
    },
    {
      status: 'inProgress',
      value: (inProgress.length * 100) / totalLength,
    },
    {
      status: 'rejected',
      value: (rejected.length * 100) / totalLength,
    },
  ].filter(item => !!item.value);

  function renderLegendItem(label: string, status: string) {
    return (
      <div className={styles.legendItem}>
        <span
          className={cn(styles.legendIndicator, {
            [styles.approved]: status === 'approved',
            [styles.pending]: status === 'pending',
            [styles.inProgress]: status === 'inProgress',
            [styles.rejected]: status === 'rejected',
          })}
        />
        <span className={styles.label}>{label}</span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.chart}>
        <ClaimsDonutChart data={chartData} />
      </div>
      <div className={styles.legend}>
        {!!approved.length &&
          renderLegendItem(
            `${approved.length} Successfully approved`,
            'approved'
          )}
        {!!pending.length &&
          renderLegendItem(`${pending.length} Pending Approval`, 'pending')}
        {!!inProgress.length &&
          renderLegendItem(`${inProgress.length} In progress`, 'inProgress')}
        {!!rejected.length &&
          renderLegendItem(`${rejected.length} Not approved`, 'rejected')}
      </div>
    </div>
  );
};
