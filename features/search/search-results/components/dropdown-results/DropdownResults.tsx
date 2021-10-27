import { Button } from 'components/button/Button';
import { ImageWithFallback } from 'components/image-with-fallback';
import * as Typography from 'components/Typography';
import { useSearchResults } from 'features/search/search-results';

import { getProposalSearchSummary } from 'features/search/search-results/components/dropdown-results/helpers';
import { NoSearchResultsView } from 'features/search/search-results/components/no-search-results-view';
import React, { FC, useState } from 'react';

import styles from './dropdown-results.module.scss';

interface DropdownResultsProps {
  width: number;
  onDaoClick: (id: string) => void;
  onProposalClick: () => void;
  onMemberClick: () => void;
}

export const DropdownResults: FC<DropdownResultsProps> = ({
  width,
  onDaoClick,
  onProposalClick,
  onMemberClick,
}) => {
  const { searchResults } = useSearchResults();
  const [allDaoRes, setAllDaoRes] = useState(false);
  const [allProposalRes, setAllProposalRes] = useState(false);
  const [allMembersRes, setAllMembersRes] = useState(false);

  return (
    <div className={styles.root} style={{ width }}>
      {!!searchResults?.daos.length && (
        <div>
          <Typography.Subtitle size={5} className={styles.label}>
            DAOs
          </Typography.Subtitle>
          {searchResults?.daos.slice(0, allDaoRes ? undefined : 3).map(item => {
            return (
              <Button
                variant="tertiary"
                className={styles.row}
                key={item.id}
                onClick={() => onDaoClick(item.id)}
              >
                <ImageWithFallback
                  fallbackSrc="/flag.svg"
                  loading="eager"
                  src={item.logo}
                  width={24}
                  height={24}
                  alt={`${item.name} Dao Logo`}
                />
                <div className={styles.name}>{item.name}</div>
                <div className={styles.daoId}>{item.id}</div>
              </Button>
            );
          })}
          {!allDaoRes && searchResults?.daos.length > 3 && (
            <Button
              variant="tertiary"
              className={styles.toggle}
              onClick={() => setAllDaoRes(true)}
            >
              See all results ({searchResults?.daos.length})
            </Button>
          )}
        </div>
      )}

      {!!searchResults?.proposals.length && (
        <div>
          <Typography.Subtitle size={5} className={styles.label}>
            Proposals
          </Typography.Subtitle>
          {searchResults?.proposals
            .slice(0, allProposalRes ? undefined : 3)
            .map(item => {
              return getProposalSearchSummary(item, onProposalClick);
            })}
          {!allProposalRes && searchResults?.proposals.length > 3 && (
            <Button
              variant="tertiary"
              className={styles.toggle}
              onClick={() => setAllProposalRes(true)}
            >
              See all results ({searchResults?.proposals.length})
            </Button>
          )}
        </div>
      )}

      {!!searchResults?.members.length && (
        <div>
          <Typography.Subtitle size={5} className={styles.label}>
            Members
          </Typography.Subtitle>
          {searchResults?.members
            .slice(0, allMembersRes ? undefined : 3)
            .map(item => {
              return (
                <Button
                  variant="tertiary"
                  onClick={onMemberClick}
                  className={styles.row}
                  key={item.id}
                >
                  <strong>{item.name}</strong>
                </Button>
              );
            })}
          {!allMembersRes && searchResults?.members.length > 3 && (
            <Button
              variant="tertiary"
              className={styles.toggle}
              onClick={() => setAllMembersRes(true)}
            >
              See all results ({searchResults?.members.length})
            </Button>
          )}
        </div>
      )}

      {!searchResults?.proposals.length &&
        !searchResults?.daos.length &&
        !searchResults?.members.length && <NoSearchResultsView />}
    </div>
  );
};
