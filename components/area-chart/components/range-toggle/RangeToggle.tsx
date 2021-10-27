import React, { FC } from 'react';
import cn from 'classnames';

import { DOMAIN_RANGES } from 'components/area-chart/helpers';

import { Button } from 'components/button/Button';
import s from './RangeToggle.module.scss';

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
  onClick: (type: string) => void;
  activeRange: string;
}

const RangeToggle: FC<RangeToggleProps> = ({ onClick, activeRange }) => (
  <div className={s.root}>
    {TOGGLE_SET.map(({ label, type }) => (
      <Button
        key={type}
        size="small"
        className={cn(s.toggle, {
          [s.active]: activeRange === type,
        })}
        onClick={() => onClick(type)}
      >
        {label}
      </Button>
    ))}
  </div>
);

export default RangeToggle;
