import React, { FC, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { useMeasure } from 'react-use';
import { useSwipeable } from 'react-swipeable';

import { IconButton } from 'components/button/IconButton';
import { StatCard } from 'astro_2.0/features/DaoDashboard/components/StatCard';
import { StatPanel } from 'astro_2.0/features/DaoDashboard/components/StatPanel';

import { TControlTab } from 'astro_2.0/features/Discover/types';

import { useWindowResize } from 'hooks/useWindowResize';
import { useSyncRefs } from 'hooks/useSyncRefs';

import styles from './ControlTabs.module.scss';

interface ControlTabsProps {
  items: TControlTab[];
  onSelect: (id: string) => void;
  activeView: string;
  className?: string;
}

function getContainerProps(width: number): [number, number] {
  if (width < 400) {
    return [1, 0];
  }

  if (width < 500) {
    return [2, 1];
  }

  return [3, 2];
}

export const ControlTabs: FC<ControlTabsProps> = ({
  items,
  onSelect,
  activeView,
  className,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [ref, { width }] = useMeasure();
  const CARD_GAP = 12;
  const [NUM_VISIBLE_CARDS, GAPS_COUNT] = getContainerProps(width);
  const cardWidth = Math.floor(
    (width - CARD_GAP * GAPS_COUNT) / NUM_VISIBLE_CARDS
  );

  const handleNavigate = useCallback(
    (isForward: boolean) => {
      if (rootRef.current) {
        const currentScrollLeft = rootRef.current.scrollLeft;

        const scroll = isForward
          ? currentScrollLeft + cardWidth + 12
          : currentScrollLeft - cardWidth - 12;

        const newScroll = scroll < 0 ? 0 : scroll;

        rootRef.current.scroll({
          left: newScroll,
          top: 0,
          behavior: 'smooth',
        });

        setScrollLeft(newScroll);
      }
    },
    [cardWidth]
  );

  const onWindowResize = useCallback(() => {
    const selectedItem = document.querySelector(`.${styles.active}`);

    if (selectedItem) {
      setTimeout(() => {
        selectedItem.scrollIntoView({
          block: 'nearest',
          inline: 'center',
        });

        if (rootRef.current) {
          const currentScrollLeft = rootRef?.current?.scrollLeft;

          setScrollLeft(currentScrollLeft);
        }
      }, 500);
    }
  }, []);

  const mergeRefs = useSyncRefs(rootRef, ref);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleNavigate(true);
    },
    onSwipedRight: () => {
      handleNavigate(false);
    },
  });

  useWindowResize(onWindowResize);

  return (
    <div {...handlers}>
      {items.length > NUM_VISIBLE_CARDS && (
        <div className={styles.scrollControls}>
          <IconButton
            icon="buttonArrowLeft"
            size="medium"
            disabled={scrollLeft <= 0}
            className={cn(styles.scrollControlButton, {
              [styles.disabled]: scrollLeft <= 0,
            })}
            onClick={() => handleNavigate(false)}
          />
          <IconButton
            icon="buttonArrowRight"
            size="medium"
            disabled={scrollLeft + width >= cardWidth * items.length}
            className={cn(styles.scrollControlButton, {
              [styles.disabled]: scrollLeft + width >= cardWidth * items.length,
            })}
            onClick={() => handleNavigate(true)}
          />
        </div>
      )}
      <div className={cn(styles.root, className)} ref={mergeRefs}>
        {items.map(({ id, label, value, trend, icon }) => (
          <StatCard
            key={id}
            selected={activeView === id}
            className={cn(styles.card, {
              [styles.active]: activeView === id,
            })}
            style={{
              maxWidth: cardWidth,
            }}
            onClick={() => {
              if (activeView !== id) {
                onSelect(id);
              }
            }}
          >
            <StatPanel
              icon={icon}
              title={label}
              value={value}
              trend={trend}
              className={styles.cardPanel}
              titleClassName={styles.cardTitle}
              trendClassName={styles.trend}
              valueClassName={styles.value}
            />
          </StatCard>
        ))}
      </div>
    </div>
  );
};
