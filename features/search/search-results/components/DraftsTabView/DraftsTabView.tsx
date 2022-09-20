import React from 'react';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider';

import { DraftProposalFeedItem } from 'types/draftProposal';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';

import styles from './DraftsTabView.module.scss';

export const DraftsTabView: React.FC = () => {
  const { searchResults } = useSearchResults();
  const { query, drafts } = searchResults || {};

  const renderItem = (item: DraftProposalFeedItem) => {
    return (
      <DraftCard
        key={item.id}
        data={item}
        flag=""
        daoId={item.daoId}
        disableEdit
      />
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.listWrapper}>
        <DraftsDataProvider>
          {drafts?.length ? (
            <Highlighter className={styles.highlighterRoot}>
              {drafts.map(item => renderItem(item))}
            </Highlighter>
          ) : (
            <NoResultsView
              title={query ? `No results for ${query}` : 'No results'}
              subTitle="We couldn't find anything matching your search. Try again with a
        different term."
            />
          )}
        </DraftsDataProvider>
      </div>
    </div>
  );
};
