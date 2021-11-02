import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { FeedCategories } from 'types/proposal';

import styles from './CategoriesList.module.scss';

const FEED_CATEGORIES = [
  { value: FeedCategories.Governance, label: 'Governance' },
  { value: FeedCategories.Financial, label: 'Financial' },
  { value: FeedCategories.Bounties, label: 'Bounties' },
  { value: FeedCategories.Members, label: 'Members' },
  { value: FeedCategories.Polls, label: 'Polls' },
];

const CategoriesList = ({
  query,
  queryName,
  disabled,
  className,
}: Props): JSX.Element => {
  return (
    <div className={classNames(styles.categoriesListRoot, className)}>
      <p className={styles.categoriesListTitle}>Choose a filter</p>
      <ul
        className={classNames(styles.categoriesList, {
          [styles.categoriesListActive1]:
            query[queryName] === FeedCategories.Governance,
          [styles.categoriesListActive2]:
            query[queryName] === FeedCategories.Financial,
          [styles.categoriesListActive3]:
            query[queryName] === FeedCategories.Bounties,
          [styles.categoriesListActive4]:
            query[queryName] === FeedCategories.Members,
          [styles.categoriesListActive5]:
            query[queryName] === FeedCategories.Polls,
        })}
      >
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

type Props = {
  disabled?: boolean;
  queryName: 'category';
  query: Record<string, string | string[]>;
  className?: string;
};

CategoriesList.defaultProps = { disabled: undefined, className: undefined };

export default CategoriesList;
