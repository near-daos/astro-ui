import { useRouter } from 'next/router';
import get from 'lodash/get';
import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import {
  BOND_DETAIL,
  CHART_DATA,
  PROPOSAL_DATA,
  TRANSACTIONS_DATA,
  VOTE_DETAILS
} from 'lib/mocks/treasury/tokens';
import { ChartData, TransactionCardInput } from 'lib/types/treasury';

import { TransactionCard } from 'components/cards/transaction-card';
import { Pagination } from 'components/pagination';
import { ExpandedProposalCard } from 'components/cards/expanded-proposal-card';
import { RequestPayout } from 'components/cards/proposal-card';
import { useModal } from 'components/modal';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';

import styles from './TransactionsPage.module.scss';

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const ITEMS_PER_PAGE = 10;

interface TransactionPageProps {
  chartData: ChartData[];
  transactions: TransactionCardInput[];
  numberOfTokens: number;
  usdValue: number;
}

const TransactionsPage: React.FC<TransactionPageProps> = ({
  chartData = CHART_DATA,
  transactions = TRANSACTIONS_DATA,
  numberOfTokens = 876,
  usdValue = 457836.35
}) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tokenId } = router.query;
  const pageCount = Math.round(transactions.length / ITEMS_PER_PAGE);
  const [currentPageContent, setCurrentPageContent] = useState<
    TransactionCardInput[]
  >(() => transactions.slice(0, ITEMS_PER_PAGE));
  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup, {
    type: 'send',
    voteDetails: VOTE_DETAILS,
    bondDetail: BOND_DETAIL
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
      sortByRecent
        ? b.tokensBalance - a.tokensBalance
        : a.tokensBalance - b.tokensBalance
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
        value: Intl.NumberFormat('en-US').format(usdValue),
        currency: 'USD'
      }
    ];
  }, [transactions, numberOfTokens, usdValue]);

  return (
    <div className={styles.root}>
      <div className={styles.back}>
        <Link href="/treasury/tokens">
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
            <TransactionCard {...transaction} />
          </Button>
        ))}
        <ExpandedProposalCard
          {...PROPOSAL_DATA}
          isOpen={isProposalDetailsOpened}
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          onLike={() => {}}
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          onDislike={() => {}}
          onClose={closeProposalDetails}
        >
          <RequestPayout amount={678} recipient="jonathan.near" tokens="NEAR" />
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

export default TransactionsPage;
