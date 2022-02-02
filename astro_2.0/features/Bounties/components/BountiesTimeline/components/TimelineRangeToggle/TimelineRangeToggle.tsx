import React, { FC, useCallback } from 'react';
import cn from 'classnames';

import { TimelineGranularity } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './TimelineRangeToggle.module.scss';

interface TimelineRangeToggleProps {
  onChange: (val: TimelineGranularity) => void;
  selected: TimelineGranularity;
}

const range = ['day', 'month'] as TimelineGranularity[];

export const TimelineRangeToggle: FC<TimelineRangeToggleProps> = ({
  onChange,
  selected,
}) => {
  const handleClick = useCallback(
    (zoomIn: boolean) => {
      const selectedIndex = range.findIndex(item => item === selected);

      if (zoomIn) {
        const nextIndex = selectedIndex !== 0 ? selectedIndex - 1 : 0;

        onChange(range[nextIndex]);
      } else {
        const nextIndex =
          selectedIndex !== range.length - 1
            ? selectedIndex + 1
            : range.length - 1;

        onChange(range[nextIndex]);
      }
    },
    [onChange, selected]
  );

  return (
    <div className={styles.root}>
      <Button
        onClick={() => handleClick(true)}
        size="block"
        disabled={range.findIndex(item => item === selected) === 0}
        variant="transparent"
        className={cn(styles.btn)}
      >
        <Icon name="plus" className={styles.icon} />
      </Button>
      <div className={styles.divider} />
      <Button
        onClick={() => handleClick(false)}
        size="block"
        disabled={
          range.findIndex(item => item === selected) === range.length - 1
        }
        variant="transparent"
        className={cn(styles.btn)}
      >
        <Icon name="minus" className={styles.icon} />
      </Button>
    </div>
  );
};
