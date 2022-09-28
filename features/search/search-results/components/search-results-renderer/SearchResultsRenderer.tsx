import React, { FC } from 'react';

import Head from 'next/head';
import { Tabs } from 'components/Tabs';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { DaosTabView } from 'features/search/search-results/components/daos-tab-view';
import { ProposalsTabView } from 'features/search/search-results/components/proposals-tab-view';
import { MembersTabView } from 'features/search/search-results/components/MembersTabView';
// import { CommentsTabView } from 'features/search/search-results/components/CommentsTabView';
import { DraftsTabView } from 'features/search/search-results/components/DraftsTabView';

import styles from './search-results-renderer.module.scss';

export const SearchResultsRenderer: FC = () => {
  const { searchResults } = useSearchResults();

  const TABS = [
    {
      id: 0,
      label: `DAOs (${
        searchResults?.totals?.daos ?? searchResults?.daos.length ?? 0
      })`,
      content: <DaosTabView />,
      className: styles.tabsListItem,
    },
    {
      id: 1,
      label: `Proposals (${
        searchResults?.totals?.proposals ?? searchResults?.proposals.length ?? 0
      })`,
      content: <ProposalsTabView />,
      className: styles.tabsListItem,
    },
    {
      id: 2,
      label: `Members (${searchResults?.members.length ?? 0})`,
      content: <MembersTabView />,
      className: styles.tabsListItem,
    },
    {
      id: 3,
      label: `Drafts (${
        searchResults?.totals?.drafts ?? searchResults?.drafts?.length ?? 0
      })`,
      content: <DraftsTabView />,
      className: styles.tabsListItem,
    },
    // {
    //   id: 4,
    //   label: `Comments (${
    //     searchResults?.totals?.comments ?? searchResults?.comments?.length ?? 0
    //   })`,
    //   content: <CommentsTabView />,
    //   className: styles.tabsListItem,
    // },
  ];

  return (
    <div className={styles.root}>
      <Head>
        <title>Search results</title>
      </Head>
      <div className={styles.header}>
        <span className={styles.secondaryLabel}>results for</span>
        <span>&nbsp;&lsquo;{searchResults?.query}&rsquo;</span>
      </div>
      <div className={styles.content}>
        <Tabs
          skipShallow
          tabs={TABS}
          tabsWrapperClassName={styles.tabsRoot}
          tabsListRootClassName={styles.tabsListRoot}
        />
      </div>
    </div>
  );
};
