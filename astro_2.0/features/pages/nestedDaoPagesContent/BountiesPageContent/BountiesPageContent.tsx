import React, { Children, cloneElement, isValidElement, FC } from 'react';
import useQuery from 'hooks/useQuery';
import cn from 'classnames';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';
import { ViewToggle } from 'astro_2.0/features/Bounties/components/ViewToggle';
import { Dropdown } from 'components/Dropdown';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import {
  BOUNTIES_PAGE_FILTER_OPTIONS,
  BOUNTIES_PAGE_SORT_OPTIONS,
} from 'astro_2.0/features/Bounties/helpers';

import { useDaoCustomTokens } from 'context/DaoTokensContext';

import styles from './BountiesPageContent.module.scss';

export interface BountiesPageContentProps {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  hideFilters?: boolean;
}

export const BountiesPageContent: FC<BountiesPageContentProps> = ({
  toggleCreateProposal,
  daoContext,
  children,
  hideFilters = false,
}) => {
  const { dao } = daoContext;
  const { tokens } = useDaoCustomTokens();

  const { query, updateQuery } = useQuery<{
    bountyFilter: string;
    bountySort: string;
  }>({ shallow: false });

  function handleCreateProposal(
    bountyId: number,
    proposalVariant: ProposalVariant
  ) {
    if (toggleCreateProposal) {
      toggleCreateProposal({ bountyId, proposalVariant });
    }
  }

  function renderChildren() {
    return Children.map(children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          tokens,
          handleCreateProposal,
          dao,
        });
      }

      return null;
    });
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bounties</h1>
        {!hideFilters && (
          <div className={styles.filters}>
            <div className={cn(styles.filter, styles.desktopOnly)}>
              <span className={styles.filterLabel}>Sorting by:</span>
              <Dropdown
                menuClassName={styles.filterMenu}
                value={query.bountySort ?? BOUNTIES_PAGE_SORT_OPTIONS[0].value}
                onChange={val => updateQuery('bountySort', val)}
                options={BOUNTIES_PAGE_SORT_OPTIONS}
              />
            </div>
            <div className={styles.filter}>
              <span className={styles.filterLabel}>Filter:</span>
              <Dropdown
                menuClassName={styles.filterMenu}
                value={
                  query.bountyFilter ?? BOUNTIES_PAGE_FILTER_OPTIONS[0].value
                }
                onChange={val => updateQuery('bountyFilter', val)}
                options={BOUNTIES_PAGE_FILTER_OPTIONS}
              />
            </div>
          </div>
        )}
        <ViewToggle
          dao={dao}
          className={cn(styles.toggle, {
            [styles.alignRight]: hideFilters,
          })}
        />
      </div>
      {renderChildren()}
    </div>
  );
};
