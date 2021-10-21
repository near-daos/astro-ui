import { Button } from 'components/button/Button';
import React, {
  CSSProperties,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { ListOnScrollProps, VariableSizeList } from 'react-window';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import ScrollList from 'components/scroll-list/ScrollList';
import { IconButton } from 'components/button/IconButton';
import { TokenCard } from 'components/cards/token-card';
import { Header } from 'components/cards/token-card/components/header';
import { useModal } from 'components/modal';

import { CopyButton } from 'features/copy-button';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';
import { Token } from 'types/token';

import { ChartData } from 'lib/types/treasury';
import { formatCurrency } from 'utils/formatCurrency';
import { useNearPrice } from 'hooks/useNearPrice';
import { useAuthContext } from 'context/AuthContext';

import styles from 'pages/dao/[dao]/treasury/tokens/tokens.module.scss';

export interface TokensPageProps {
  data: {
    chartData: ChartData[];
    tokens: Token[];
    totalValue: string;
    totalTokensValue: number;
  };
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  data: { chartData, tokens, totalValue, totalTokensValue }
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const { accountId, login } = useAuthContext();

  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send'
  });
  const [showResetScroll, setShowResetScroll] = useState(false);
  const scrollListRef = useRef<VariableSizeList>(null);
  const isMobileOrTablet = useMedia('(max-width: 768px)');
  const nearPrice = useNearPrice();

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

  const handleClick = useCallback(
    () => (accountId ? showRequestPayoutPopup() : login()),
    [login, showRequestPayoutPopup, accountId]
  );

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
    const tokenData = tokens[index];

    return (
      <div
        style={{
          ...style,
          marginTop: isMobileOrTablet ? '16px' : '8px',
          marginBottom: isMobileOrTablet ? '16px' : '8px'
        }}
      >
        <TokenCard
          id={tokenData.tokenId}
          icon={tokenData.icon}
          tokenName={tokenData.symbol}
          tokensBalance={Number(tokenData.totalSupply)}
          totalValue={formatCurrency(
            parseFloat(tokenData.totalSupply ?? '0') * nearPrice
          )}
          voteWeight={(Number(tokenData.totalSupply) * 100) / totalTokensValue}
          href={
            tokenData.symbol === 'near'
              ? `/dao/${daoId}/treasury/tokens/transactions/${tokens[index].tokenId}`
              : null
          }
        />
      </div>
    );
  };

  const captions = useMemo(
    () => [
      {
        label: 'Total value',
        value: formatCurrency(parseFloat(totalValue) * nearPrice),
        currency: 'USD'
      }
    ],
    [nearPrice, totalValue]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Tokens</h1>
        <Button variant="black" size="small" onClick={handleClick}>
          Send tokens
        </Button>
      </div>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          {daoId}
          <CopyButton text={daoId} className={styles.icon} />
        </div>
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} captions={captions} />
      </div>
      <div className={styles.label}>All tokens</div>
      <div className={styles.tokens}>
        <Header />
        <ScrollList
          itemCount={tokens.length}
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
