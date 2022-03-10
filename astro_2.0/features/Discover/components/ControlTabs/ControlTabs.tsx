import React, { FC, useEffect } from 'react';
import cn from 'classnames';

import { StatCard } from 'astro_2.0/features/DaoDashboard/components/StatCard';
import { StatPanel } from 'astro_2.0/features/DaoDashboard/components/StatPanel';

import { TControlTab } from 'astro_2.0/features/Discover/types';

import styles from './ControlTabs.module.scss';

interface ControlTabsProps {
  items: TControlTab[];
  onSelect: (id: string) => void;
  activeView: string;
  className?: string;
  loading: boolean;
}

export const ControlTabs: FC<ControlTabsProps> = ({
  items,
  onSelect,
  activeView,
  className,
  loading,
}) => {
  useEffect(() => {
    const selectedItem = document.querySelector(`.${styles.active}`);

    if (selectedItem) {
      setTimeout(() => {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }, 500);
    }
  }, [activeView]);

  return (
    <div className={cn(styles.root, className)}>
      {items.map(({ id, label, value, trend }) => (
        <StatCard
          key={id}
          selected={activeView === id}
          className={cn(styles.card, {
            [styles.active]: activeView === id,
          })}
          disabled={loading}
          onClick={() => onSelect(id)}
        >
          <StatPanel
            title={label}
            value={value}
            trend={trend}
            className={styles.cardPanel}
            titleClassName={styles.cardTitle}
            trendClassName={styles.trend}
            valueClassName={styles.value}
          />
        </StatCard>
      ))}
    </div>
  );
};
