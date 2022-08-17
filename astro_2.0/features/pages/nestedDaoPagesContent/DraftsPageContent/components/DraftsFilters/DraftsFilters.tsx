import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { FEED_CATEGORIES } from 'constants/proposals';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ListItem } from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';

import styles from './DraftsFilters.module.scss';

export const DraftsFilters: FC = () => {
  const { t } = useTranslation();
  const { query, replace } = useRouter();
  const { category, view } = query;

  const feedCategories = useMemo(
    () =>
      FEED_CATEGORIES.map(item => ({
        ...item,
        label: t(item.label.toLowerCase()),
      })),
    [t]
  );

  const renderTab = (item: ListItem) => {
    const { value: itemVal, label, icon } = item;

    return (
      <Button
        key={item.label}
        className={cn(styles.itemLink, {
          [styles.active]: category === itemVal || (!itemVal && !category),
        })}
        variant="transparent"
        size="small"
        onClick={async () => {
          await replace(
            {
              query: {
                ...query,
                category: category === itemVal ? '' : itemVal,
              },
            },
            undefined,
            {
              shallow: false,
              scroll: false,
            }
          );
        }}
      >
        {icon && <Icon name={icon} className={styles.icon} />}
        {label}
      </Button>
    );
  };

  const handleFilterSaved = async () => {
    await replace(
      {
        query: {
          ...query,
          view: view ? '' : 'saved',
        },
      },
      undefined,
      {
        shallow: false,
        scroll: false,
      }
    );
  };

  const handleRemoveFilters = async () => {
    await replace(
      {
        query: {
          ...query,
          view: '',
          category: '',
        },
      },
      undefined,
      {
        shallow: false,
        scroll: false,
      }
    );
  };

  return (
    <div className={styles.root}>
      {category || view ? (
        <Button
          variant="transparent"
          size="small"
          className={styles.clearFilter}
          onClick={handleRemoveFilters}
        >
          <Icon name="close" className={styles.clearFilterIcon} />
        </Button>
      ) : null}
      <Button
        variant="transparent"
        size="small"
        className={cn(styles.itemLink, { [styles.active]: view })}
        onClick={handleFilterSaved}
      >
        <Icon name="draftBookmark" className={styles.icon} />
        {t('drafts.feed.filters.view.saved')}
      </Button>
      {feedCategories
        .filter(item => {
          if (category) {
            return item.value === category;
          }

          return true;
        })
        .map(renderTab)}
    </div>
  );
};
