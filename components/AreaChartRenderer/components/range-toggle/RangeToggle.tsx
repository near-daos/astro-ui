import cn from 'classnames';
import React, { FC } from 'react';
import { useMedia } from 'react-use';

import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';
import { Range } from 'components/AreaChartRenderer/types';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/Dropdown';

import styles from './RangeToggle.module.scss';

const TOGGLE_SET = [
  // {
  //   label: '24H',
  //   type: DOMAIN_RANGES.DAY,
  // },
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
  className?: string;
  timeRanges?: { label: string; type: Range }[];
}

const RangeToggle: FC<RangeToggleProps> = ({
  onClick,
  activeRange,
  className,
  timeRanges,
}) => {
  const isMobile = useMedia('(max-width: 920px)');
  const ranges = timeRanges || TOGGLE_SET;

  return (
    <div className={cn(styles.root, className)}>
      {isMobile ? (
        <Dropdown
          className={styles.select}
          controlClassName={styles.selectControl}
          menuClassName={styles.selectMenu}
          value={activeRange}
          onChange={v => {
            onClick(v as Range);
          }}
          options={ranges.map(({ label, type }) => ({
            label,
            value: type,
          }))}
        />
      ) : (
        ranges.map(({ label, type }) => (
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
        ))
      )}
    </div>
  );
};

export default RangeToggle;
