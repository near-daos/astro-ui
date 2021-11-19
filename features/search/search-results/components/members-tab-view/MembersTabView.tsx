import React, { FC, useCallback } from 'react';

import { NoResultsView } from 'features/no-results-view';
import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useSearchResults } from 'features/search/search-results/SearchResults';

import MemberCard, { MemberCardPopup } from 'components/cards/member-card';
import { Badge, Variant } from 'components/badge/Badge';
import { useModal } from 'components/modal';

import { GROUP_COLOR } from './constants';

import styles from './members-tab-view.module.scss';

export const MembersTabView: FC = () => {
  const { searchResults } = useSearchResults();
  const [showCardModal] = useModal(MemberCardPopup);

  const handleCardClick = useCallback(
    async d => {
      await showCardModal(d);
    },
    [showCardModal]
  );

  if ((searchResults?.members || []).length === 0) {
    return (
      <NoResultsView
        title={
          searchResults?.query
            ? `No results for ${searchResults.query}`
            : 'No results'
        }
        subTitle="We couldn't find anything matching your search. Try again with a
        different term."
      />
    );
  }

  return (
    <div className={styles.root}>
      <Highlighter>
        <div className={styles.content}>
          {searchResults?.members.map(item => (
            <MemberCard
              onClick={handleCardClick}
              key={item.name}
              title={item.name}
              votes={item.votes}
              tokens={item.tokens}
            >
              {item.groups.map(grp => (
                <Badge
                  key={grp}
                  size="small"
                  variant={GROUP_COLOR[grp] as Variant}
                >
                  {grp}
                </Badge>
              ))}
            </MemberCard>
          ))}
        </div>
      </Highlighter>
    </div>
  );
};
