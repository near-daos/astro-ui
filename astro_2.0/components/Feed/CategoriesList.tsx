import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { ProposalCategories } from 'types/proposal';

import styles from './CategoriesList.module.scss';

const FEED_CATEGORIES = [
  { value: ProposalCategories.Governance, label: 'Governance' },
  { value: ProposalCategories.Financial, label: 'Financial' },
  { value: ProposalCategories.Bounties, label: 'Bounties' },
  { value: ProposalCategories.Members, label: 'Members' },
  { value: ProposalCategories.Polls, label: 'Polls' },
];

type CategoriesListProps = {
  disabled?: boolean;
  queryName: 'category';
  query: Record<string, string | string[]>;
  className?: string;
};

const CategoriesList: React.FC<CategoriesListProps> = ({
  query,
  queryName,
  disabled,
  className,
}) => {
  const { [queryName]: value, ...otherQuery } = query;

  return (
    <div className={classNames(styles.categoriesListRoot, className)}>
      <p className={styles.categoriesListTitle}>Choose a filter</p>
      <ul
        className={classNames(styles.categoriesList, {
          [styles.categoriesListActive1]:
            value === ProposalCategories.Governance,
          [styles.categoriesListActive2]:
            value === ProposalCategories.Financial,
          [styles.categoriesListActive3]: value === ProposalCategories.Bounties,
          [styles.categoriesListActive4]: value === ProposalCategories.Members,
          [styles.categoriesListActive5]: value === ProposalCategories.Polls,
        })}
      >
        <li>
          <Link href={{ query: otherQuery }} replace shallow scroll={false}>
            <a
              className={classNames(styles.categoriesListItem, {
                [styles.categoriesListItemSelected]: !value,
                '.disabled': disabled,
              })}
              tabIndex={disabled ? -1 : 0}
            >
              All
            </a>
          </Link>
        </li>

        {FEED_CATEGORIES.map(item => {
          const href = {
            query: {
              ...query,
              [queryName]: item.value,
            },
          };

          if (query[queryName] === item.value) {
            delete (href.query as Partial<typeof href.query>).category;
          }

          return (
            <li key={item.value}>
              <Link href={href} replace shallow scroll={false}>
                <a
                  className={classNames(styles.categoriesListItem, {
                    [styles.categoriesListItemSelected]:
                      query[queryName] === item.value,
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
    </div>
  );
};

export default CategoriesList;
