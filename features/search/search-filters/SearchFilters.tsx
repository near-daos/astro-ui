import React, { FC, FormEvent, useCallback } from 'react';

import { Dropdown } from 'components/dropdown/Dropdown';
import { Toggle } from 'components/toggle/Toggle';

import { searchOptions, showOptions } from './helpers';

import styles from './search-filters.module.scss';

export type FilterName =
  | 'show'
  | 'search'
  | 'tasks'
  | 'groups'
  | 'treasury'
  | 'governance';

export interface SearchFiltersProps {
  projectName: string;
  showFilter: string;
  searchFilter: string;
  includeTasks: boolean;
  includeGroups: boolean;
  includeTreasury: boolean;
  includeGovernance: boolean;
  onChange: (
    filterName: FilterName,
    filterValue: string | boolean | undefined
  ) => void;
}

export const SearchFilters: FC<SearchFiltersProps> = ({
  projectName,
  showFilter,
  searchFilter,
  includeTasks,
  includeGroups,
  includeTreasury,
  includeGovernance,
  onChange
}) => {
  const handleChange = useCallback(
    (name: FilterName, value: string | boolean | undefined) => {
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <div>
      <div className={styles.header}>
        <div>results for</div>
        <div className={styles.hide}>&nbsp;</div>
        <div>&lsquo;{projectName}&rsquo;</div>
      </div>
      <div className={styles.content}>
        <div className={styles.show}>
          <Dropdown
            options={showOptions}
            onChange={value => handleChange('show', value)}
            value={showFilter}
            defaultValue={showOptions[0].value}
          />
        </div>
        <div className={styles.search}>
          <Dropdown
            options={searchOptions}
            onChange={value => handleChange('search', value)}
            value={searchFilter}
            defaultValue={searchOptions[0].value}
          />
        </div>
        <div className={styles.type1}>
          <Toggle
            label="Tasks"
            defaultChecked={includeTasks}
            checked={includeTasks}
            onChange={(e: FormEvent) =>
              handleChange('tasks', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
        <div className={styles.type2}>
          <Toggle
            label="Groups"
            defaultChecked={includeGroups}
            checked={includeGroups}
            onChange={(e: FormEvent) =>
              handleChange('groups', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
        <div className={styles.type3}>
          <Toggle
            label="Treasury"
            defaultChecked={includeTreasury}
            checked={includeTreasury}
            onChange={(e: FormEvent) =>
              handleChange('treasury', (e.target as HTMLInputElement).checked)
            }
          />
        </div>
        <div className={styles.type4}>
          <Toggle
            label="Governance"
            defaultChecked={includeGovernance}
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
