import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';
import {
  BOND_DETAIL,
  CHART_DATA,
  PROPOSAL_DATA,
  TRANSACTIONS_DATA,
  VOTE_DETAILS
} from 'lib/mocks/treasury/tokens';
import dynamic from 'next/dynamic';
import { ChartData, TransactionCardInput } from 'lib/types/treasury';
import { TransactionCard } from 'components/cards/transaction-card';
import classNames from 'classnames';
import { Pagination } from 'components/pagination';
import { ExpandedProposalCard } from 'components/cards/expanded-proposal-card';
import { RequestPayout } from 'components/cards/proposal-card';
import { BreadCrumbs } from 'components/breadcrumbs';
import styles from './TransactionsPage.module.scss';

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const ITEMS_PER_PAGE = 10;

interface TransactionPageProps {
  chartData: ChartData[];
  transactions: TransactionCardInput[];
}

const TransactionsPage: React.FC<TransactionPageProps> = ({
  chartData = CHART_DATA,
  transactions = TRANSACTIONS_DATA
}) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tokenId } = router.query;
  const pageCount = Math.round(transactions.length / ITEMS_PER_PAGE);
  const [currentPageContent, setCurrentPageContent] = useState<
    TransactionCardInput[]
  >(() => transactions.slice(0, ITEMS_PER_PAGE));

  const [isSendTokenModalOpened, showSendTokenModal] = useState(false);
  const [isProposalDetailsOpened, showProposalDetailsModal] = useState(false);
  const [sortByRecent, setSortByRecent] = useState(true);

  const sendToken = useCallback(() => {
    showSendTokenModal(false);
  }, []);

  const openModal = useCallback(() => {
    showSendTokenModal(true);
  }, []);

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

  return (
    <div className={styles.root}>
      <div className={styles.back}>
        <Link href="/treasury/tokens">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className={styles.backLink}>
            <Icon name="buttonArrowLeft" className={styles.icon} />
            All tokens
          </a>
        </Link>
        <BreadCrumbs />
      </div>
      <div className={styles.token}>
        <Icon name="iconNear" className={styles.icon} />
        &nbsp; NEAR
      </div>
      <div className={styles.send}>
        <Button variant="secondary" onClick={openModal}>
          Send tokens
        </Button>
        <RequestPayoutPopup
          type="send"
          isOpen={isSendTokenModalOpened}
          onClose={sendToken}
          voteDetails={VOTE_DETAILS}
          bondDetail={BOND_DETAIL}
        />
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} />
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
