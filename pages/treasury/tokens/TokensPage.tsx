import React, { CSSProperties, useCallback, useRef, useState } from 'react';

import { IconButton } from 'components/button/IconButton';
import { Button } from 'components/button/Button';
import dynamic from 'next/dynamic';
import {
  BOND_DETAIL,
  CHART_DATA,
  TOKENS_DATA,
  VOTE_DETAILS
} from 'pages/treasury/tokens/mock';
import { TokenCard, TokenName } from 'components/cards/token-card';
import { Header } from 'components/cards/token-card/components/header';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';
import { ChartData } from 'pages/treasury/types';
import { useModal } from 'components/modal';
import ScrollList from 'components/scroll-list/ScrollList';
import { FixedSizeList, ListOnScrollProps } from 'react-window';
import styles from './tokens.module.scss';

interface TokenCardInput {
  id: string;
  tokenName: TokenName;
  tokensBalance: number;
  totalValue: number;
  voteWeight: number;
  href: '';
}

interface TokensPageProps {
  accountName: string;
  chartData: ChartData[];
  tokens: TokenCardInput[];
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  accountName = 'meowzers.sputnikdao.near',
  chartData = CHART_DATA,
  tokens = TOKENS_DATA
}) => {
  const [items] = useState(tokens);
  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send',
    voteDetails: VOTE_DETAILS,
    bondDetail: BOND_DETAIL
  });
  const [showResetScroll, setShowResetScroll] = useState(false);
  const ref = useRef<FixedSizeList>(null);

  const handleScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (scrollOffset > 100) {
      setShowResetScroll(true);
    } else {
      setShowResetScroll(false);
    }
  }, []);

  const handleClick = useCallback(() => showRequestPayoutPopup(), [
    showRequestPayoutPopup
  ]);

  const resetScroll = useCallback(() => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.scrollToItem(0);
  }, [ref]);

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
        marginTop: '8px',
        marginBottom: '8px'
      }}
    >
      <TokenCard
        {...items[index]}
        href={`/treasury/tokens/transactions/${items[index].id}`}
      />
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          {accountName}
          <IconButton icon="buttonCopy" size="medium" />
        </div>
      </div>
      <div className={styles.send}>
        <Button variant="secondary" onClick={handleClick}>
          Send tokens
        </Button>
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} />
      </div>
      <div className={styles.label}>All tokens</div>
      <div className={styles.tokens}>
        <Header />
        <ScrollList
          itemCount={items.length}
          onScroll={handleScroll}
          height={700}
          itemSize={96}
          ref={ref}
          renderItem={renderCard}
        />
      </div>

      {showResetScroll ? (
        <IconButton
          icon="buttonResetScroll"
          size="large"
          className={styles.reset}
          onClick={resetScroll}
        />
      ) : null}
    </div>
  );
};

export default TokensPage;
