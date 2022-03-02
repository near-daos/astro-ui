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
}

export const ControlTabs: FC<ControlTabsProps> = ({
  items,
  onSelect,
  activeView,
  className,
}) => {
  useEffect(() => {
    const selectedItem = document.querySelector(`.${styles.active}`);

    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
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
          onClick={() => onSelect(id)}
        >
          <StatPanel
            title={label}
            value={value}
            trend={trend}
            titleClassName={styles.cardTitle}
          />
        </StatCard>
      ))}
    </div>
  );
};
