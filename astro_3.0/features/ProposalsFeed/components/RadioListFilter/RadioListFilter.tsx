import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import { ListItem } from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';
import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';

import styles from './RadioListFilter.module.scss';

interface Props {
  disabled?: boolean;
  queryName: string;
  className?: string;
  list?: ListItem[];
  hideAllOption?: boolean;
  shallowUpdate?: boolean;
  itemClassName?: string;
  onChange: (query: string, val: string) => void;
  active: string;
}

export const RadioListFilter: FC<Props> = ({
  list,
  disabled,
  queryName,
  className,
  itemClassName,
  onChange,
  active,
}) => {
  const handleChange = useCallback(
    val => {
      onChange(queryName, val);
    },
    [onChange, queryName]
  );

  function renderFilterItem(item: ListItem) {
    const { value: itemVal, label, disabled: disabledItem, icon } = item;

    return (
      <Radio
        value={itemVal}
        label={item.label}
        key={item.label}
        className={cn(
          styles.item,
          {
            [styles.active]: active === itemVal || (!itemVal && !active),
            [styles.disabled]: disabled || disabledItem,
          },
          itemClassName
        )}
      >
        {icon && <Icon name={icon} className={styles.icon} />}
        {label}
      </Radio>
    );
  }

  return (
    <div className={cn(styles.root, className)}>
      <RadioGroup
        activeItemClassName={styles.activeRadio}
        value={active || 'All'}
        onChange={handleChange}
      >
        <ul className={styles.items}>{list?.map(renderFilterItem)}</ul>
      </RadioGroup>
    </div>
  );
};
