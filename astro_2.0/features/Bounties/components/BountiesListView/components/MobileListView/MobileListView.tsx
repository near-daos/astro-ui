import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { Tabs } from 'components/Tabs';
import { SectionItem } from 'astro_2.0/features/Bounties/components/BountiesListView/types';
import { SectionRow } from 'astro_2.0/features/Bounties/components/BountiesListView/components/SectionRow';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { DAO } from 'types/dao';

import styles from './MobileListView.module.scss';

interface MobileListViewProps {
  proposals: SectionItem[];
  bounties: SectionItem[];
  completed: SectionItem[];
  accountId: string;
  dao: DAO;
}

export const MobileListView: FC<MobileListViewProps> = ({
  proposals,
  bounties,
  completed,
  accountId,
  dao,
}) => {
  const { t } = useTranslation();

  function getTabContent(
    items: SectionItem[],
    status: 'Pending' | 'InProgress' | 'Completed'
  ) {
    return (
      <div className={styles.tabContent}>
        {!items.length && <NoResultsView title="No results found" />}
        {items.map(item => {
          return (
            <SectionRow
              id={item.id}
              key={item.id}
              accountId={accountId}
              dao={dao}
              isFirstRow={false}
              item={item}
              status={status}
            />
          );
        })}
      </div>
    );
  }

  const TABS = [
    {
      id: 0,
      label: t(`bountiesPage.comingSoon`),
      content: getTabContent(proposals, 'Pending'),
      className: styles.tabsListItem,
      activeClassName: styles.activeTabsListItem,
    },
    {
      id: 1,
      label: t(`bountiesPage.bounty`),
      content: getTabContent(bounties, 'InProgress'),
      className: styles.tabsListItem,
      activeClassName: styles.activeTabsListItem,
    },
    {
      id: 2,
      label: t(`bountiesPage.completed`),
      content: getTabContent(completed, 'Completed'),
      className: styles.tabsListItem,
      activeClassName: styles.activeTabsListItem,
    },
  ];

  return (
    <div className={styles.root}>
      <Tabs
        skipShallow
        tabs={TABS}
        tabsWrapperClassName={styles.tabsRoot}
        tabsListRootClassName={styles.tabsListRoot}
      />
    </div>
  );
};
