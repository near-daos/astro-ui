import { useSelectedDAO } from 'hooks/useSelectedDao';
import React, {
  CSSProperties,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { ListOnScrollProps, VariableSizeList } from 'react-window';
import { useMedia } from 'react-use';
import dynamic from 'next/dynamic';

import ScrollList from 'components/scroll-list/ScrollList';
import { IconButton } from 'components/button/IconButton';
import { Button } from 'components/button/Button';
import { TokenCard, TokenName } from 'components/cards/token-card';
import { Header } from 'components/cards/token-card/components/header';
import { useModal } from 'components/modal';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';

import {
  BOND_DETAIL,
  CHART_DATA,
  TOKENS_DATA,
  VOTE_DETAILS
} from 'lib/mocks/treasury/tokens';
import { ChartData } from 'lib/types/treasury';

import styles from 'pages/dao/[dao]/treasury/tokens/tokens.module.scss';

interface TokenCardInput {
  id: string;
  tokenName: TokenName;
  tokensBalance: number;
  totalValue: number;
  voteWeight: number;
  href: '';
}

interface TokensPageProps {
  chartData: ChartData[];
  tokens: TokenCardInput[];
  totalValue: number;
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  chartData = CHART_DATA,
  tokens = TOKENS_DATA,
  totalValue = 45876
}) => {
  const selectedDao = useSelectedDAO();
  const accountName = selectedDao?.id || '';

  const [items] = useState(tokens);
  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send',
    voteDetails: VOTE_DETAILS,
    bondDetail: BOND_DETAIL
  });
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

  const getItemHeight = useCallback(() => (isMobileOrTablet ? 168 : 96), [
    isMobileOrTablet
  ]);

  const handleClick = useCallback(() => showRequestPayoutPopup(), [
    showRequestPayoutPopup
  ]);

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
        marginTop: isMobileOrTablet ? '16px' : '8px',
        marginBottom: isMobileOrTablet ? '16px' : '8px'
      }}
    >
      <TokenCard
        {...items[index]}
        href={`/treasury/tokens/transactions/${items[index].id}`}
      />
    </div>
  );

  const captions = useMemo(
    () => [
      {
        label: 'Total value',
        value: Intl.NumberFormat('en-US').format(totalValue),
        currency: 'USD'
      }
    ],
    [totalValue]
  );

  const copyAccountName = useCallback(() => {
    navigator.clipboard.writeText(accountName);
  }, [accountName]);

  return (
    <div className={styles.root}>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          {accountName}
          <IconButton
            icon="buttonCopy"
            size="medium"
            className={styles.icon}
            onClick={copyAccountName}
          />
        </div>
      </div>
      <div className={styles.send}>
        <Button variant="secondary" onClick={handleClick}>
          Send tokens
        </Button>
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} captions={captions} />
      </div>
      <div className={styles.label}>All tokens</div>
      <div className={styles.tokens}>
        <Header />
        <ScrollList
          itemCount={items.length}
          onScroll={handleScroll}
          height={700}
          itemSize={getItemHeight}
          ref={scrollListRef}
          renderItem={renderCard}
        />
      </div>

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

export default TokensPage;
