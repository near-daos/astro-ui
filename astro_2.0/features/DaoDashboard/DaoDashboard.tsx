import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { StatCard } from 'astro_2.0/features/DaoDashboard/components/StatCard';
import { StatPanel } from 'astro_2.0/features/DaoDashboard/components/StatPanel';
import { StatChart } from 'astro_2.0/features/DaoDashboard/components/StatChart';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { getFundsInUsdFromTokens } from 'astro_2.0/features/DaoDashboard/helpers';
import { Loader } from 'components/loader';

import { useDaoDashboardData } from 'astro_2.0/features/DaoDashboard/hooks';

import { DAO } from 'types/dao';
import { Token } from 'types/token';

import styles from './DaoDashboard.module.scss';

interface DaoDashboardProps {
  dao: DAO;
  daoTokens: Record<string, Token>;
  className?: string;
}

export const DaoDashboard: FC<DaoDashboardProps> = ({
  dao,
  daoTokens,
  className,
}) => {
  const { t } = useTranslation();
  const {
    chartData,
    dashboardData,
    toggleView,
    activeView,
  } = useDaoDashboardData();

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.chart}>
        {chartData ? (
          <DashboardChart key={activeView} data={chartData} />
        ) : (
          <Loader />
        )}
      </div>
      <StatCard
        className={styles.funds}
        onClick={() => toggleView('DAO_FUNDS')}
      >
        <StatPanel
          title={t('daoFunds')}
          value={getFundsInUsdFromTokens(daoTokens)}
          trend={0}
        />
        {!!dashboardData.daoFundsOverTime?.length && (
          <StatChart data={dashboardData.daoFundsOverTime} />
        )}
      </StatCard>
      <StatCard
        className={styles.bounties}
        onClick={() => toggleView('BOUNTIES')}
      >
        <StatPanel
          title={t('bounties')}
          value={dashboardData.daoTvl?.bounties.number.count}
          trend={dashboardData.daoTvl?.bounties.number.growth ?? 0}
        />
      </StatCard>
      <StatCard className={styles.nfts} onClick={() => toggleView('NFTS')}>
        <StatPanel
          title={t('nfts')}
          value={dashboardData.daoTokens?.nfts.count}
          trend={dashboardData.daoTokens?.nfts.growth ?? 0}
        />
      </StatCard>
      <StatCard
        className={styles.proposals}
        onClick={() => toggleView('PROPOSALS')}
      >
        <StatPanel
          title={t('activeProposals')}
          value={dao.activeProposalsCount}
          trend={0}
        />
        <StatPanel
          title={t('proposalsInTotal')}
          value={dao.totalProposalsCount}
          trend={0}
        />
      </StatCard>
    </div>
  );
};
