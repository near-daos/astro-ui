import cn from 'classnames';
import React, { FC, FormEvent, useCallback } from 'react';

import { Toggle } from 'components/toggle/Toggle';
import { Dropdown } from 'components/dropdown/Dropdown';

import { Option, daoFilterOptions, statusFilterOptions } from './helpers';

import styles from './search-filters.module.scss';

export type FilterName =
  | 'show'
  | 'search'
  | 'tasks'
  | 'groups'
  | 'treasury'
  | 'governance';

export interface SearchFiltersProps {
  showFilter: string;
  searchFilter: string;
  includeTasks: boolean;
  includeGroups: boolean;
  includeTreasury: boolean;
  includeGovernance: boolean;
  statusDropdownOptions?: Option[];
  onChange: (
    filterName: FilterName,
    filterValue: string | boolean | undefined
  ) => void;
  showDaoFilter?: boolean;
}

export const SearchFilters: FC<SearchFiltersProps> = ({
  showFilter,
  searchFilter,
  includeTasks,
  includeGroups,
  includeTreasury,
  includeGovernance,
  showDaoFilter = true,
  statusDropdownOptions = statusFilterOptions,
  onChange
}) => {
  const handleChange = useCallback(
    (name: FilterName, value: string | boolean | undefined) => {
      onChange(name, value);
    },
    [onChange]
  );

  function renderDaoFilter() {
    let filter = null;

    if (showDaoFilter) {
      filter = (
        <>
          <div className={styles.label}>Search</div>
          <Dropdown
            className={styles.dropdown}
            options={daoFilterOptions}
            onChange={value => handleChange('search', value)}
            value={searchFilter}
            defaultValue={daoFilterOptions[0].value}
          />
        </>
      );
    }

    return <div className={styles.search}>{filter}</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.show}>
          <div className={styles.label}>Show</div>
          <Dropdown
            className={styles.dropdown}
            options={statusDropdownOptions}
            onChange={value => handleChange('show', value)}
            value={showFilter}
            defaultValue={statusDropdownOptions[0].value}
          />
        </div>
        {renderDaoFilter()}
        <div className={cn(styles.type, styles.label)}>Type</div>
        <div className={styles.type1}>
          <Toggle
            label="Tasks"
            checked={includeTasks}
            onChange={(e: FormEvent) =>
              handleChange('tasks', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
        <div className={styles.type2}>
          <Toggle
            label="Groups"
            checked={includeGroups}
            onChange={(e: FormEvent) =>
              handleChange('groups', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
        <div className={styles.type3}>
          <Toggle
            label="Treasury"
            checked={includeTreasury}
            onChange={(e: FormEvent) =>
              handleChange('treasury', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
        <div className={styles.type4}>
          <Toggle
            label="Governance"
            checked={includeGovernance}
            onChange={(e: FormEvent) =>
              handleChange('governance', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
      </div>
    </div>
  );
};
