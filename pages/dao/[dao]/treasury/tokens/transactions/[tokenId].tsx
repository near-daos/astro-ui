import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'components/button/Button';

import { Icon } from 'components/Icon';

import { ChartData } from 'lib/types/treasury';
import get from 'lodash/get';
import dynamic from 'next/dynamic';

import { TransactionCard } from 'components/cards/transaction-card';
import { Pagination } from 'components/pagination';
import { useModal } from 'components/modal';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';

import styles from 'pages/dao/[dao]/treasury/tokens/transactions/TransactionsPage.module.scss';
import { SputnikService } from 'services/SputnikService';
import { TokenDeprecated } from 'types/token';
import { Transaction } from 'types/transaction';
import { fetchNearPrice, useNearPrice } from 'hooks/useNearPrice';
import { formatCurrency } from 'utils/formatCurrency';
import { getChartData } from 'features/treasury/helpers';
import { useAuthContext } from 'context/AuthContext';

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const ITEMS_PER_PAGE = 10;

export interface TransactionPageProps {
  data: {
    chartData: ChartData[];
    transactions: Transaction[];
    numberOfTokens: number;
  };
}

const TransactionsPage: React.FC<TransactionPageProps> = ({
  data: { chartData, transactions, numberOfTokens }
}) => {
  const nearPrice = useNearPrice();
  const router = useRouter();
  const { accountId, login } = useAuthContext();

  const pageCount = Math.round(transactions.length / ITEMS_PER_PAGE);

  const [currentPageContent, setCurrentPageContent] = useState<Transaction[]>(
    () => transactions.slice(0, ITEMS_PER_PAGE)
  );

  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send'
  });

  const daoId = router.query.dao as string;

  const [sortByRecent, setSortByRecent] = useState(true);

  const handleClick = useCallback(
    () => (accountId ? showRequestPayoutPopup() : login()),
    [login, showRequestPayoutPopup, accountId]
  );

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
        selected * ITEMS_PER_PAGE,
        (selected + 1) * ITEMS_PER_PAGE
      );

      setCurrentPageContent(newContent);
    },
    [transactions]
  );

  const captions = useMemo(() => {
    const tokenType = get(transactions, '0.tokenName');

    return [
      {
        label: 'Number of tokens',
        value: numberOfTokens.toString(),
        currency: tokenType
      },
      {
        label: 'Total value',
        value: formatCurrency(numberOfTokens * nearPrice),
        currency: 'USD'
      }
    ];
  }, [transactions, numberOfTokens, nearPrice]);

  return (
    <div className={styles.root}>
      <div className={styles.back}>
        <Link href={`/dao/${daoId}/treasury/tokens`}>
          <a>
            <Icon name="buttonArrowLeft" className={styles.icon} />
            All tokens
          </a>
        </Link>
      </div>
      <div className={styles.token}>
        <Icon name="iconNear" className={styles.icon} />
        &nbsp; NEAR
      </div>
      <div className={styles.send}>
        <Button variant="secondary" onClick={handleClick}>
          Send tokens
        </Button>
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} captions={captions} />
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
          className={classNames(styles.icon, { [styles.rotate]: sortByRecent })}
        />
      </Button>
      <div className={styles.transactions}>
        {currentPageContent.map(transaction => (
          <div
            className={styles.row}
            key={`${transaction.type}_${transaction.timestamp}_${transaction.deposit}`}
          >
            <TransactionCard
              tokenName={TokenDeprecated.NEAR}
              type={transaction.type}
              deposit={transaction.deposit}
              date={transaction.date}
              accountName={transaction.signerAccountId}
            />
          </div>
        ))}
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

interface GetTransactionsQuery {
  dao: string;
  tokenId: string;
}

export const getServerSideProps = async ({
  query
}: {
  query: GetTransactionsQuery;
}): Promise<{
  props: TransactionPageProps;
}> => {
  const dao = await SputnikService.getDaoById(query.dao);
  const transactions = await SputnikService.getTransfers(query.dao);
  const price = await fetchNearPrice();

  return {
    props: {
      data: {
        chartData: getChartData(transactions, price),
        transactions,
        numberOfTokens: Number(dao?.funds) ?? '0'
      }
    }
  };
};

export default TransactionsPage;
