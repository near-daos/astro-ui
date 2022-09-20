import isEmpty from 'lodash/isEmpty';
import React, { FC, useCallback } from 'react';
import uniqBy from 'lodash/uniqBy';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useSearchResults } from 'features/search/search-results/SearchResults';

import { Badge, Variant } from 'components/Badge';
import MemberCard from 'components/cards/member-card/MemberCard/MemberCard';
import { MemberCardPopup } from 'components/cards/member-card/MemberCardPopup';
import { useModal } from 'components/modal';

import { GROUP_COLOR } from './constants';

import styles from './MembersTabView.module.scss';

export const MembersTabView: FC = () => {
  const { searchResults } = useSearchResults();
  const [showCardModal] = useModal(MemberCardPopup);

  const handleCardClick = useCallback(
    async d => {
      await showCardModal(d);
    },
    [showCardModal]
  );

  if (isEmpty(searchResults?.members)) {
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
              {uniqBy(item.groups, grp => grp).map(grp => (
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
