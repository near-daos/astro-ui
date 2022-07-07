import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';

import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';

import styles from './Filter.module.scss';

type Option = {
  value: string;
  label: string;
};

type FilterProps = {
  title: string;
  options: Option[];
  queryName: string;
};

export const Filter: FC<FilterProps> = ({ options, title, queryName }) => {
  const { query, replace } = useRouter();
  const selectedValue: string = query[queryName] as string;

  const handleChange = useCallback(
    async (value: string) => {
      const nextQuery = {
        ...query,
        [queryName]: value === `all-${queryName}` ? '' : value,
      };

      await replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: false, scroll: false }
      );
    },
    [queryName, query, replace]
  );

  return (
    <div className={styles.filter}>
      <div className={styles.filterTitle}>{title}</div>
      <RadioGroup
        itemClassName={styles.radio}
        value={selectedValue || options[0].value}
        onChange={handleChange}
      >
        {options.map(option => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            type="notifications"
          />
        ))}
      </RadioGroup>
    </div>
  );
};
