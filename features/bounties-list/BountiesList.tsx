import React, { CSSProperties, FC, useCallback, useRef, useState } from 'react';
import { Bounty, BountyStatus } from 'components/cards/bounty-card/types';
import { BountyCard } from 'components/cards/bounty-card';
import { IconButton } from 'components/button/IconButton';
import ScrollList from 'components/scroll-list/ScrollList';
import { ListOnScrollProps, VariableSizeList } from 'react-window';
import { useMedia } from 'react-use';

import styles from './bounties-list.module.scss';

export interface BountiesListProps {
  bountiesList: Bounty[];
  status: BountyStatus;
}

export const BountiesList: FC<BountiesListProps> = ({
  bountiesList,
  status
}) => {
  const [showResetScroll, setShowResetScroll] = useState(false);
  const scrollListRef = useRef<VariableSizeList>(null);
  const isMobileOrTablet = useMedia('(max-width: 767px)');

  const handleScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (scrollOffset > 100) {
      setShowResetScroll(true);
    } else {
      setShowResetScroll(false);
    }
  }, []);

  const resetScroll = useCallback(() => {
    if (!scrollListRef || !scrollListRef.current) {
      return;
    }

    scrollListRef.current.scrollToItem(0);
  }, [scrollListRef]);

  const renderCard = ({
    index,
    style
  }: {
    index: number;
    style: CSSProperties;
  }) => {
    return (
      <div
        style={{
          ...style,
          marginTop: '0',
          marginBottom: '16px'
        }}
      >
        <BountyCard data={bountiesList[index]} status={status} />
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <ScrollList
        itemCount={bountiesList.length}
        onScroll={handleScroll}
        height={700}
        itemSize={() => (isMobileOrTablet ? 240 : 96)}
        ref={scrollListRef}
        renderItem={renderCard}
      />
      {showResetScroll ? (
        <IconButton
          icon="buttonResetScroll"
          size={isMobileOrTablet ? 'medium' : 'large'}
          className={styles.reset}
          onClick={resetScroll}
        />
      ) : null}
    </div>
  );
};
