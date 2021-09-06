import React, { CSSProperties, FC, useCallback, useRef, useState } from 'react';
import { Bounty } from 'components/cards/bounty-card/types';
import { BountyCard } from 'components/cards/bounty-card';
import { IconButton } from 'components/button/IconButton';
import ScrollList from 'components/scroll-list/ScrollList';
import { ListOnScrollProps, VariableSizeList } from 'react-window';
import { useMedia } from 'react-use';
import styles from './bounties-list.module.scss';

export interface BountiesListProps {
  bountiesList: Bounty[];
  isInProgress?: boolean;
}

export const BountiesList: FC<BountiesListProps> = ({
  bountiesList,
  isInProgress
}) => {
  const myBounties = isInProgress
    ? bountiesList.filter(bounty => bounty.claimedByMe)
    : [];
  const regularBounties = isInProgress
    ? bountiesList.filter(bounty => !bounty.claimedByMe)
    : bountiesList;

  const [tasks] = useState(regularBounties);

  const [showResetScroll, setShowResetScroll] = useState(false);
  const scrollListRef = useRef<VariableSizeList>(null);
  const isMobileOrTablet = useMedia('(max-width: 768px)');

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
  }) => (
    <div
      style={{
        ...style,
        marginTop: '0',
        marginBottom: '16px'
      }}
    >
      <BountyCard {...{ data: tasks[index] }} />
    </div>
  );

  return (
    <div className={styles.root}>
      {isInProgress && myBounties.length > 0 && (
        <>
          <div className={styles.header}>Your bounties</div>
          <div className={styles.top}>
            {myBounties.map(bounty => (
              <div className={styles.card} key={bounty.amount}>
                <BountyCard {...{ data: bounty }} />
              </div>
            ))}
          </div>
        </>
      )}
      {isInProgress && <div className={styles.header}>Everyone’s bounties</div>}
      <ScrollList
        itemCount={regularBounties.length}
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
