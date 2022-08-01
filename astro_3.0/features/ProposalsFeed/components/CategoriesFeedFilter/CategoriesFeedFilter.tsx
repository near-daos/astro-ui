import React, { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import styles from './CategoriesFeedFilter.module.scss';

export type ListItem = {
  value?: string;
  label: string;
  disabled?: boolean;
};

interface Props {
  disabled?: boolean;
  queryName: string;
  className?: string;
  list?: ListItem[];
  hideAllOption?: boolean;
  shallowUpdate?: boolean;
  itemClassName?: string;
}

export const CategoriesFeedFilter: FC<Props> = ({
  list,
  disabled,
  queryName,
  className,
  itemClassName,
  hideAllOption = false,
  shallowUpdate = false,
}) => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { [queryName]: value } = query;

  const ITEM_ALL = {
    value: undefined,
    label: t('feed.filters.all'),
  };

  function renderFilterItem(item: ListItem) {
    const { value: itemVal, label, disabled: disabledItem } = item;

    const href = {
      query: {
        ...query,
        [queryName]: itemVal,
      },
    };

    const hrefClassName = cn(
      styles.itemLink,
      {
        [styles.active]: value === itemVal || (!itemVal && !value),
        [styles.disabled]: disabled || disabledItem,
      },
      itemClassName
    );

    return (
      <li className={styles.item} key={label}>
        <Link href={href} replace scroll={false} shallow={shallowUpdate}>
          <a className={hrefClassName} tabIndex={disabled ? -1 : 0}>
            {label}
          </a>
        </Link>
      </li>
    );
  }

  return (
    <div className={cn(styles.root, className)}>
      <ul className={styles.items}>
        {!hideAllOption && renderFilterItem(ITEM_ALL)}
        {list?.map(renderFilterItem)}
      </ul>
    </div>
  );
};
