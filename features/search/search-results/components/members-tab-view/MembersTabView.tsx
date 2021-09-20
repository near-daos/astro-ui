import React, { FC, useCallback } from 'react';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { NoResultsView } from 'features/search/search-results/components/no-results-view';

import MemberCard, { MemberCardPopup } from 'components/cards/member-card';
import { Badge, Variant } from 'components/badge/Badge';
import { useModal } from 'components/modal';
import { groupColor } from 'lib/mocks/groups';

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

  if (!searchResults?.members?.length)
    return <NoResultsView query={searchResults?.query} />;

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
                  variant={groupColor[grp] as Variant}
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
