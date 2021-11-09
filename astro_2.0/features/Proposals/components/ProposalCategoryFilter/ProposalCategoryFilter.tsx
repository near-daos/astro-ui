import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { ProposalCategories } from 'types/proposal';

import useQuery from 'hooks/useQuery';
import styles from './ProposalCategoryFilter.module.scss';

const FEED_CATEGORIES = [
  { value: ProposalCategories.Governance, label: 'Governance' },
  { value: ProposalCategories.Financial, label: 'Financial' },
  { value: ProposalCategories.Bounties, label: 'Bounties' },
  { value: ProposalCategories.Members, label: 'Members' },
  { value: ProposalCategories.Polls, label: 'Polls' },
];

const ACTIVE_CLASSES_MAP = {
  [ProposalCategories.Governance]: styles.categoriesListActive1,
  [ProposalCategories.Financial]: styles.categoriesListActive2,
  [ProposalCategories.Bounties]: styles.categoriesListActive3,
  [ProposalCategories.Members]: styles.categoriesListActive4,
  [ProposalCategories.Polls]: styles.categoriesListActive5,
};

type ProposalCategoryFiltertProps = {
  className?: string;
  disabled?: boolean;
};

export const ProposalCategoryFilter: React.FC<ProposalCategoryFiltertProps> = ({
  disabled,
  className,
}) => {
  const { query } = useQuery<{
    proposalCategory: ProposalCategories;
  }>();

  return (
    <nav className={cn(styles.categoriesListRoot, className)}>
      <p className={styles.categoriesListTitle}>Choose a filter</p>
      <ul
        className={cn(
          styles.categoriesList,
          ACTIVE_CLASSES_MAP[query.proposalCategory]
        )}
      >
        <li>
          <Link
            href={{
              query: { ...query, proposalCategory: query.proposalCategory },
            }}
            replace
            shallow
            scroll={false}
          >
            <a
              className={cn(styles.categoriesListItem, {
                [styles.categoriesListItemSelected]: !query.proposalCategory,
                '.disabled': disabled,
              })}
              tabIndex={disabled ? -1 : 0}
            >
              All
            </a>
          </Link>
        </li>

        {FEED_CATEGORIES.map(item => {
          return (
            <li key={item.value}>
              <Link
                href={{
                  query: {
                    ...query,
                    proposalCategory: item.value,
                  },
                }}
                replace
                shallow
                scroll={false}
              >
                <a
                  className={cn(styles.categoriesListItem, {
                    [styles.categoriesListItemSelected]:
                      query.proposalCategory === item.value,
                    '.disabled': disabled,
                  })}
                  tabIndex={disabled ? -1 : 0}
                >
                  {item.label}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
