import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import classNames from 'classnames';

import { useAuthContext } from 'context/AuthContext';
import { useNearPrice } from 'hooks/useNearPrice';
import { useModal } from 'components/modal';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';
import { formatCurrency } from 'utils/formatCurrency';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { CopyButton } from 'features/copy-button';

import { TokenCard } from 'components/cards/token-card';
import { Token, TokenDeprecated } from 'types/token';

import { ChartCaption } from 'components/area-chart/components/chart-caption';
import { ChartData } from 'lib/types/treasury';

import { TransactionCard } from 'components/cards/transaction-card';
import { Receipt } from 'types/transaction';
import { Pagination } from 'components/pagination';

import styles from 'pages/dao/[dao]/treasury/tokens/tokens.module.scss';
import { useCustomTokensContext } from 'context/CustomTokensContext';

export interface TokensPageProps {
  data: {
    chartData: ChartData[];
    daoTokens: Token[];
    totalValue: string;
    receipts: Receipt[];
  };
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  data: { chartData, daoTokens, totalValue, receipts }
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const nearPrice = useNearPrice();
  const { accountId, login } = useAuthContext();
  const TRANSACTIONS_PER_PAGE = 10;
  const { setTokens } = useCustomTokensContext();

  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send'
  });

  const handleClick = useCallback(
    () => (accountId ? showRequestPayoutPopup() : login()),
    [login, showRequestPayoutPopup, accountId]
  );

  const captions = useMemo(
    () => [
      {
        label: 'Total Value Locked',
        value: formatCurrency(parseFloat(totalValue) * nearPrice),
        currency: 'USD'
      }
    ],
    [nearPrice, totalValue]
  );

  useEffect(() => {
    setTokens(daoTokens);
  }, [setTokens, daoTokens]);

  const pageCount = Math.round(receipts.length / TRANSACTIONS_PER_PAGE);

  const [currentPageContent, setCurrentPageContent] = useState<Receipt[]>(() =>
    receipts.slice(0, TRANSACTIONS_PER_PAGE)
  );

  const [sortByRecent, setSortByRecent] = useState(true);

  const filterClickHandler = useCallback(() => {
    const sorted = currentPageContent.sort((a, b) =>
      sortByRecent ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

    setCurrentPageContent(sorted);
    setSortByRecent(!sortByRecent);
  }, [currentPageContent, sortByRecent]);

  const pageChangeHandler = useCallback(
    ({ selected }) => {
      const newContent = receipts.slice(
        selected * TRANSACTIONS_PER_PAGE,
        (selected + 1) * TRANSACTIONS_PER_PAGE
      );

      setCurrentPageContent(newContent);
    },
    [receipts]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Tokens</h1>
        <Button variant="black" size="small" onClick={handleClick}>
          Propose Payout
        </Button>
      </div>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          {daoId}
          <CopyButton text={daoId} className={styles.icon} />
        </div>
      </div>
      <div className={styles.total}>
        <ChartCaption captions={captions} />
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} />
      </div>
      <div className={styles.tokens}>
        {daoTokens.map(({ tokenId, icon, symbol, balance }) => (
          <TokenCard
            key={`${tokenId}-${symbol}`}
            symbol={symbol}
            icon={symbol === 'NEAR' ? 'NEAR' : icon}
            balance={Number(balance)}
            totalValue={
              symbol === TokenDeprecated.NEAR && balance
                ? formatCurrency(parseFloat(balance) * nearPrice)
                : null
            }
          />
        ))}
      </div>
      <div className={styles.label}>Transactions</div>
      <Button
        variant="tertiary"
        className={styles.filter}
        onClick={filterClickHandler}
      >
        {sortByRecent ? 'Most recent' : 'Less recent'}
        <Icon
          name="buttonArrowUp"
          className={classNames(styles.filterIcon, {
            [styles.rotate]: sortByRecent
          })}
        />
      </Button>
      <div className={styles.transactions}>
        {currentPageContent.map(
          ({ type, timestamp, deposit, date, predecessorAccountId }) => (
            <div className={styles.row} key={`${type}_${timestamp}_${deposit}`}>
              <TransactionCard
                tokenName={TokenDeprecated.NEAR}
                type={type}
                deposit={deposit}
                date={date}
                accountName={predecessorAccountId}
              />
            </div>
          )
        )}
      </div>
      {pageCount > 0 ? (
        <div className={styles.pagination}>
          <Pagination
            pageCount={pageCount}
            onPageActive={pageChangeHandler}
            onPageChange={pageChangeHandler}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TokensPage;
