import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { StatCard } from 'astro_2.0/features/DaoDashboard/components/StatCard';
import { StatPanel } from 'astro_2.0/features/DaoDashboard/components/StatPanel';

import { StatData } from 'astro_2.0/features/DaoDashboard/types';

import { SputnikStatsService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { formatCurrency } from 'utils/formatCurrency';
import { StatChart } from 'astro_2.0/features/DaoDashboard/components/StatChart';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';

import styles from './DaoDashboard.module.scss';

interface DaoDashboardProps {
  className?: string;
  funds: StatData;
  bounties: StatData;
  nfts: StatData;
  activeProposals: StatData;
  proposalsInTotal: StatData;
}

export const DaoDashboard: FC<DaoDashboardProps> = ({
  className,
  funds,
  bounties,
  nfts,
  activeProposals,
  proposalsInTotal,
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartDataElement[]>([]);

  useEffect(() => {
    SputnikStatsService.getDaoUsersInteractionsStats(daoId).then(data => {
      setChartData(
        data.map(item => ({
          x: new Date(item.timestamp),
          y: item.count,
        }))
      );
    });
  }, [daoId]);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.chart}>
        {!!chartData?.length && <DashboardChart data={chartData} />}
      </div>
      <StatCard className={styles.funds}>
        <StatPanel
          title={t('daoFunds')}
          value={`${formatCurrency(funds.count)} USD`}
          trend={funds.growth}
        />
        {!!chartData?.length && <StatChart data={chartData} />}
      </StatCard>
      <StatCard className={styles.bounties}>
        <StatPanel
          title={t('bounties')}
          value={bounties.count}
          trend={bounties.growth}
        />
      </StatCard>
      <StatCard className={styles.nfts}>
        <StatPanel title={t('nfts')} value={nfts.count} trend={nfts.growth} />
      </StatCard>
      <StatCard className={styles.proposals}>
        <StatPanel
          title={t('activeProposals')}
          value={activeProposals.count}
          trend={activeProposals.growth}
        />
        <StatPanel
          title={t('proposalsInTotal')}
          value={proposalsInTotal.count}
          trend={proposalsInTotal.growth}
        />
      </StatCard>
    </div>
  );
};
