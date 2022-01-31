import React, { FC, useRef, useState } from 'react';
import cn from 'classnames';
import { useClickAway } from 'react-use';
import { TimelineMilestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { Milestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/Milestone';
import styles from './StackedMilestones.module.scss';

interface StackedMilestonesProps {
  data: TimelineMilestone[];
}

export const StackedMilestones: FC<StackedMilestonesProps> = ({ data }) => {
  const hasGrouptMilestones = !!data.find(item => !item.color);
  const withColor = data.find(item => item.color);
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useClickAway(ref, () => {
    setOpen(false);
  });

  return (
    <div
      className={cn(styles.root, {
        [styles.open]: open,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        onClick={() => setOpen(!open)}
        ref={ref}
        className={cn(styles.indicator)}
        style={{
          backgroundColor:
            !hasGrouptMilestones && withColor ? withColor.color : '#000',
        }}
      >
        {data.length}
      </div>
      {open && (
        <div className={styles.panel}>
          {data.map(item => (
            <Milestone data={item} className={styles.listItem} />
          ))}
        </div>
      )}
    </div>
  );
};
