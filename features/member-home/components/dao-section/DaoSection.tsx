import React, { FC } from 'react';

import { ProposalCardRenderer } from 'components/cards/proposal-card';

import styles from 'features/search/search-results/components/proposals-tab-view/proposals-tab-view.module.scss';
import { Proposal } from 'types/proposal';
import { Button } from 'components/button/Button';

interface DaoSectionProps {
  daoName: string;
  proposals: Proposal[];
  flag: string;
  onFilterSet: () => void;
  expanded: boolean;
  filter: string | null;
}

export const DaoSection: FC<DaoSectionProps> = ({
  daoName,
  proposals,
  flag,
  onFilterSet,
  expanded,
  filter
}) => {
  return (
    <>
      <div className={styles.daoDivider}>
        {!filter && (
          <>
            <div
              className={styles.flag}
              style={{ backgroundImage: `url(${flag})` }}
            />
            <h3>{daoName}</h3>
            <div className={styles.divider} />
          </>
        )}
        {!expanded && proposals.length > 3 && (
          <Button
            variant="tertiary"
            className={styles.toggle}
            onClick={() => onFilterSet()}
          >
            View all ({proposals.length})
          </Button>
        )}
      </div>
      {proposals.slice(0, expanded ? undefined : 3).map(item => {
        return (
          <div className={styles.cardWrapper} key={item.id}>
            <ProposalCardRenderer proposal={item} />
          </div>
        );
      })}
    </>
  );
};
