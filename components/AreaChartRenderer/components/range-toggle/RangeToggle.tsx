import cn from 'classnames';
import React, { FC } from 'react';

import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';
import { Range } from 'components/AreaChartRenderer/types';
import { Button } from 'components/button/Button';

import styles from './RangeToggle.module.scss';

const TOGGLE_SET = [
  {
    label: '24H',
    type: DOMAIN_RANGES.DAY,
  },
  {
    label: '1W',
    type: DOMAIN_RANGES.WEEK,
  },
  {
    label: '1M',
    type: DOMAIN_RANGES.MONTH,
  },
  {
    label: '1Y',
    type: DOMAIN_RANGES.YEAR,
  },
  {
    label: 'All',
    type: DOMAIN_RANGES.ALL,
  },
];

interface RangeToggleProps {
  onClick: (type: Range) => void;
  activeRange: string;
}

const RangeToggle: FC<RangeToggleProps> = ({ onClick, activeRange }) => (
  <div className={styles.root}>
    {TOGGLE_SET.map(({ label, type }) => (
      <Button
        key={type}
        size="small"
        className={cn(styles.toggle, {
          [styles.active]: activeRange === type,
        })}
        onClick={() => onClick(type)}
      >
        {label}
      </Button>
    ))}
  </div>
);

export default RangeToggle;
