import React, { FC, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useLockBodyScroll } from 'react-use';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { RadioListFilter } from 'astro_3.0/features/ProposalsFeed/components/RadioListFilter';
import { ListItem } from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';

import {
  CATEGORIES,
  TYPES,
  SORT,
} from 'astro_3.0/features/ProposalsFeed/components/MobileFilters/constants';

import styles from './MobileFilters.module.scss';

export const MobileFilters: FC = () => {
  const { query, replace } = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    category: 'All',
    type: 'All',
    sort: 'createdAt,DESC',
  });

  useLockBodyScroll(open);

  const categoriesList = useMemo<ListItem[]>(
    () =>
      CATEGORIES.map(
        item =>
          ({
            ...item,
            label: t(item.label.toLowerCase()),
          } as ListItem)
      ),
    [t]
  );

  const typeList = useMemo<ListItem[]>(
    () =>
      TYPES.map(
        item =>
          ({
            ...item,
            label: t(item.label.toLowerCase()),
          } as ListItem)
      ),
    [t]
  );

  const sortList = useMemo<ListItem[]>(
    () =>
      SORT.map(
        item =>
          ({
            ...item,
            label: t(item.label.toLowerCase()),
          } as ListItem)
      ),
    [t]
  );

  const handleChange = useCallback(
    (category: string, val: string) => {
      setState({
        ...state,
        [category]: val,
      });
    },
    [state]
  );

  const handleSubmit = useCallback(async () => {
    const href = {
      query: {
        ...query,
        ...state,
      },
    };

    await replace(href, undefined, {
      shallow: true,
      scroll: false,
    });

    setOpen(false);
  }, [query, replace, state]);

  return (
    <div className={styles.root}>
      <div>
        <Button
          variant="transparent"
          size="block"
          className={styles.control}
          onClick={() => setOpen(true)}
        >
          <Icon name="filtersMenu" className={styles.icon} />
        </Button>
      </div>
      <div
        className={cn(styles.content, {
          [styles.open]: open,
        })}
      >
        <div className={styles.header}>
          <h3>Filters</h3>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <Title size={5} className={styles.title}>
              Category
            </Title>
            <RadioListFilter
              queryName="category"
              active={state.category}
              onChange={handleChange}
              list={categoriesList}
            />
          </section>

          <section className={styles.section}>
            <Title size={5} className={styles.title}>
              Type
            </Title>
            <RadioListFilter
              queryName="type"
              active={state.type}
              onChange={handleChange}
              list={typeList}
            />
          </section>

          <section className={styles.section}>
            <Title size={5} className={styles.title}>
              Sort by
            </Title>
            <RadioListFilter
              queryName="sort"
              active={state.sort}
              onChange={handleChange}
              list={sortList}
            />
          </section>
        </div>

        <section className={styles.footer}>
          <Button
            variant="secondary"
            size="flex"
            className={styles.button}
            capitalize
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="green"
            size="flex"
            className={styles.button}
            capitalize
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </section>
      </div>
    </div>
  );
};
