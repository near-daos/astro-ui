import React, { FC, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { usePopper } from 'react-popper';
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
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  useClickAway(ref, () => {
    setOpen(false);
  });

  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement
  );

  function renderResultsDropdown() {
    if (typeof document === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <AnimatePresence>
        {open && (
          <div
            id="astro_search-results"
            ref={setPopperElement}
            style={{ ...popperStyles.popper, zIndex: 100 }}
            {...attributes.popper}
          >
            <motion.div
              className={styles.panel}
              initial={{ opacity: 0, transform: 'translateY(40px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0 }}
            >
              {data.map(item => (
                <Milestone
                  data={item}
                  className={styles.listItem}
                  key={`${item.type}_${item.date.toISOString()}`}
                />
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

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
      <div
        className={styles.anchor}
        ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
      />
      {renderResultsDropdown()}
    </div>
  );
};
