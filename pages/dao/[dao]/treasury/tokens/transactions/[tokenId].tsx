import { useRouter } from 'next/router';
import get from 'lodash/get';
import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { PROPOSAL_DATA } from 'lib/mocks/treasury/tokens';
import { ChartData } from 'lib/types/treasury';

import { TransactionCard } from 'components/cards/transaction-card';
import { Pagination } from 'components/pagination';
import { ExpandedProposalCard } from 'components/cards/expanded-proposal-card';
import { RequestPayout } from 'components/cards/proposal-card';
import { useModal } from 'components/modal';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';

import styles from 'pages/dao/[dao]/treasury/tokens/transactions/TransactionsPage.module.scss';
import { SputnikService } from 'services/SputnikService';
import { Token } from 'types/token';
import { Transaction } from 'types/transaction';
import { useNearPrice } from 'hooks/useNearPrice';
import { formatCurrency } from 'utils/formatCurrency';
import { getChartData } from 'features/treasury/helpers';

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
  const { dao } = router.query;

  const pageCount = Math.round(transactions.length / ITEMS_PER_PAGE);

  const [currentPageContent, setCurrentPageContent] = useState<Transaction[]>(
    () => transactions.slice(0, ITEMS_PER_PAGE)
  );

  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send'
  });

  const [isProposalDetailsOpened, showProposalDetailsModal] = useState(false);
  const [sortByRecent, setSortByRecent] = useState(true);

  const handleClick = useCallback(() => showRequestPayoutPopup(), [
    showRequestPayoutPopup
  ]);

  const closeProposalDetails = useCallback(() => {
    showProposalDetailsModal(false);
  }, []);

  const openProposalDetails = useCallback(() => {
    showProposalDetailsModal(true);
  }, []);

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
        <Link href={`/dao/${dao}/treasury/tokens`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
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
          <Button
            variant="tertiary"
            size="block"
            className={styles.row}
            key={transaction.transactionId}
            onClick={openProposalDetails}
          >
            <TransactionCard
              tokenName={Token.NEAR}
              type={transaction.type}
              deposit={transaction.deposit}
              date={transaction.date}
              accountName={transaction.signerAccountId}
            />
          </Button>
        ))}
        <ExpandedProposalCard
          {...PROPOSAL_DATA}
          isOpen={isProposalDetailsOpened}
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          onLike={() => {}}
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          onDislike={() => {}}
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          onRemove={() => {}}
          onClose={closeProposalDetails}
        >
          <RequestPayout amount="678" recipient="jonathan.near" tokens="NEAR" />
        </ExpandedProposalCard>
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

  return {
    props: {
      data: {
        chartData: getChartData(transactions, query.dao),
        transactions,
        numberOfTokens: Number(dao?.funds) ?? '0'
      }
    }
  };
};

export default TransactionsPage;
