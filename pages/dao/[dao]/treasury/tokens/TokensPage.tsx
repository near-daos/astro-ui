import React, { useCallback, useMemo, useState } from 'react';
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
// import { TOKENS_MOCK } from 'lib/mocks/treasury/tokens';

import { ChartCaption } from 'components/area-chart/components/chart-caption';
import { ChartData } from 'lib/types/treasury';

import { TransactionCard } from 'components/cards/transaction-card';
import { Transaction } from 'types/transaction';
import { Pagination } from 'components/pagination';

import styles from 'pages/dao/[dao]/treasury/tokens/tokens.module.scss';

export interface TokensPageProps {
  data: {
    chartData: ChartData[];
    tokens: Token[];
    totalValue: string;
    transactions: Transaction[];
  };
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  data: { chartData, tokens, totalValue, transactions }
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const nearPrice = useNearPrice();
  const { accountId, login } = useAuthContext();
  const TRANSACTIONS_PER_PAGE = 10;

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

  const pageCount = Math.round(transactions.length / TRANSACTIONS_PER_PAGE);

  const [currentPageContent, setCurrentPageContent] = useState<Transaction[]>(
    () => transactions.slice(0, TRANSACTIONS_PER_PAGE)
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
      const newContent = transactions.slice(
        selected * TRANSACTIONS_PER_PAGE,
        (selected + 1) * TRANSACTIONS_PER_PAGE
      );

      setCurrentPageContent(newContent);
    },
    [transactions]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Tokens</h1>
        <Button variant="black" size="small" onClick={handleClick}>
          Send Tokens
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
        {/* todo: remove temporary tokens mock data */}
        {/* {TOKENS_MOCK.map(({ tokenId, icon, totalSupply }) => ( */}
        {tokens.map(({ tokenId, icon, totalSupply }) => (
          <TokenCard
            key={`${tokenId}-${totalSupply}`}
            tokenId={tokenId}
            icon={icon}
            tokensBalance={Number(totalSupply)}
            totalValue={
              tokenId === TokenDeprecated.NEAR && totalSupply
                ? formatCurrency(parseFloat(totalSupply) * nearPrice)
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
          ({ type, timestamp, deposit, date, signerAccountId }) => (
            <div className={styles.row} key={`${type}_${timestamp}_${deposit}`}>
              <TransactionCard
                tokenName={TokenDeprecated.NEAR}
                type={type}
                deposit={deposit}
                date={date}
                accountName={signerAccountId}
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
