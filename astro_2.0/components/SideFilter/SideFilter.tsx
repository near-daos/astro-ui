import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import findIndex from 'lodash/findIndex';
import React, { CSSProperties, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

import styles from './SideFilter.module.scss';

export type ListItem = {
  value?: string;
  label: string;
  disabled?: boolean;
};

interface SideFilterProps {
  title: string;
  disabled?: boolean;
  forceHorizontalView?: boolean;
  queryName: string;
  className?: string;
  titleClassName?: string;
  list?: ListItem[];
  hideAllOption?: boolean;
  shallowUpdate?: boolean;
  itemClassName?: string;
  markerOffset?: number;
}

export const SideFilter = ({
  list,
  title,
  disabled,
  queryName,
  className,
  titleClassName,
  itemClassName,
  hideAllOption = false,
  shallowUpdate = false,
  forceHorizontalView = false,
  markerOffset = 0,
}: SideFilterProps): JSX.Element => {
  const { t } = useTranslation();

  const ITEM_ALL = {
    value: undefined,
    label: t('feed.filters.all'),
  };

  const { query } = useRouter();
  const { [queryName]: value } = query;

  function getActiveMarkTransformValue() {
    const HUNDRED_PERCENT = 100;

    const selectedValue = value as string;
    const index = findIndex(list, { value: selectedValue });

    const transformVal =
      index === -1
        ? markerOffset
        : index * HUNDRED_PERCENT + (hideAllOption ? 0 : HUNDRED_PERCENT);

    return {
      '--filter-active-transform': `${transformVal}%`,
    } as CSSProperties;
  }

  function renderFilterItem(item: ListItem) {
    const { value: itemVal, label, disabled: disabledItem } = item;

    const href = {
      query: {
        ...query,
        [queryName]: itemVal,
      },
    };

    const hrefClassName = cn(
      styles.categoriesListItem,
      {
        [styles.categoriesListItemSelected]:
          value === itemVal || (!itemVal && !value),
        [styles.disabled]: disabled || disabledItem,
      },
      itemClassName
    );

    return (
      <li className={styles.categoriesListItemWrapper} key={label}>
        <Link href={href} replace scroll={false} shallow={shallowUpdate}>
          <a className={hrefClassName} tabIndex={disabled ? -1 : 0}>
            {label}
          </a>
        </Link>
      </li>
    );
  }

  useEffect(() => {
    const selectedItem = document.querySelector(
      `.${styles.categoriesListItemSelected}`
    );

    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [value]);

  return (
    <div
      className={cn(styles.categoriesListRoot, className, {
        [styles.categoriesListHorizontal]: forceHorizontalView,
      })}
    >
      <p className={cn(styles.categoriesListTitle, titleClassName)}>{title}</p>

      <ul
        className={styles.categoriesList}
        style={getActiveMarkTransformValue()}
      >
        {!hideAllOption && renderFilterItem(ITEM_ALL)}
        {list?.map(renderFilterItem)}
      </ul>
    </div>
  );
};
