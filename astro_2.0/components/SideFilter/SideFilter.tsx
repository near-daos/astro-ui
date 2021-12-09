import cn from 'classnames';
import Link from 'next/link';
import findIndex from 'lodash/findIndex';
import React, { CSSProperties } from 'react';

import styles from './SideFilter.module.scss';

const ITEM_ALL = {
  value: '',
  label: 'All',
};

type ListItem = {
  value: string;
  label: string;
};

interface SideFilterProps {
  title: string;
  disabled?: boolean;
  queryName: string;
  query: Record<string, string | string[]>;
  className?: string;
  titleClassName?: string;
  list?: ListItem[];
}

export const SideFilter = ({
  list,
  query,
  title,
  disabled,
  queryName,
  className,
  titleClassName,
}: SideFilterProps): JSX.Element => {
  const { [queryName]: value } = query;

  function getActiveMarkTransformValue() {
    const HUNDRED_PERCENT = 100;

    const selectedValue = value as string;
    const index = findIndex(list, { value: selectedValue });

    const transformVal =
      index === -1 ? 0 : index * HUNDRED_PERCENT + HUNDRED_PERCENT;

    return {
      '--filter-active-transform': `${transformVal}%`,
    } as CSSProperties;
  }

  function renderFilterItem(item: ListItem) {
    const { value: itemVal, label } = item;

    const href = {
      query: {
        ...query,
        [queryName]: itemVal,
      },
    };

    const hrefClassName = cn(styles.categoriesListItem, {
      [styles.categoriesListItemSelected]: value === itemVal,
      [styles.disabled]: disabled,
    });

    return (
      <li className={styles.categoriesListItemWrapper} key={label}>
        <Link href={href} replace shallow scroll={false}>
          <a className={hrefClassName} tabIndex={disabled ? -1 : 0}>
            {label}
          </a>
        </Link>
      </li>
    );
  }

  return (
    <div className={cn(styles.categoriesListRoot, className)}>
      <p className={cn(styles.categoriesListTitle, titleClassName)}>{title}</p>

      <ul
        className={styles.categoriesList}
        style={getActiveMarkTransformValue()}
      >
        {renderFilterItem(ITEM_ALL)}
        {list?.map(renderFilterItem)}
      </ul>
    </div>
  );
};
