import React, { FC, useCallback } from 'react';

import { GroupFormInput, GroupFormType } from 'features/groups/types';
import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { GroupPopup } from 'features/groups';
import { NoResultsView } from 'features/search/search-results/components/no-results-view';

import MemberCard, { MemberCardPopup } from 'components/cards/member-card';
import { Badge, Variant } from 'components/badge/Badge';
import { useModal } from 'components/modal';
import { groupColor, groupPopupData } from 'lib/mocks/groups';

import styles from './members-tab-view.module.scss';

export const MembersTabView: FC = () => {
  const { searchResults } = useSearchResults();
  const [showCardModal] = useModal(MemberCardPopup);
  const [showGroupModal] = useModal(GroupPopup);

  const handleRemoveClick = useCallback(
    async item => {
      await showGroupModal({
        initialValues: {
          ...(groupPopupData.initialValues as GroupFormInput),
          groups: item.groups,
          name: item.name,
          groupType: GroupFormType.REMOVE_FROM_GROUP
        }
      });
    },
    [showGroupModal]
  );

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
              onRemoveClick={async () => {
                await handleRemoveClick(item);
              }}
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
