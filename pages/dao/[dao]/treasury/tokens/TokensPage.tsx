import React, { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import get from 'lodash/get';
import { NextPage } from 'next';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { DaoAddressLink } from 'components/DaoAddressLink';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { TokenCard } from 'components/cards/TokenCard';
import { ChartCaption } from 'components/area-chart/components/chart-caption';
import { TransactionCard } from 'components/cards/TransactionCard';
import { Pagination } from 'components/Pagination';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { Loader } from 'components/loader';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import {
  getAccumulatedTokenValue,
  sorter,
  useTokenFilteredData,
} from 'features/treasury/helpers';
import { formatYoktoValue } from 'helpers/format';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { formatCurrency } from 'utils/formatCurrency';

import styles from './Tokens.module.scss';

export interface TokensPageProps {
  daoContext: DaoContext;
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });
const TRANSACTIONS_PER_PAGE = 10;

const TokensPage: NextPage<TokensPageProps> = ({
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
}) => {
  const { tokens } = useDaoCustomTokens();

  const {
    chartData,
    transactionsData,
    onFilterChange,
    viewToken,
    loading,
    error,
  } = useTokenFilteredData(tokens);

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const captions = useMemo(() => {
    const total = getAccumulatedTokenValue(tokens);

    if (total) {
      return [
        {
          label: 'Total Value Locked',
          value: formatCurrency(total),
          currency: 'USD',
        },
      ];
    }

    return [];
  }, [tokens]);

  const pageCount = Math.ceil(transactionsData.length / TRANSACTIONS_PER_PAGE);
  const [activePage, setActivePage] = useState(0);
  const [sortAsc, setSortAsc] = useState(false);
  const filterClickHandler = useCallback(() => {
    setSortAsc(!sortAsc);
  }, [sortAsc]);
  const pageChangeHandler = useCallback(({ selected }) => {
    setActivePage(selected);
  }, []);

  function renderContent() {
    if (error) {
      return (
        <NoResultsView
          className={styles.requestStatus}
          title="Error loading transaction data"
        />
      );
    }

    if (loading) {
      return <Loader className={styles.requestStatus} />;
    }

    if (!transactionsData.length) {
      return (
        <NoResultsView
          className={styles.requestStatus}
          title={
            viewToken === 'NEAR'
              ? 'No transactions data found'
              : 'No transactions data found for last 24 hours'
          }
        />
      );
    }

    return (
      <>
        <div className={styles.chart}>
          {!!chartData.length && !loading && (
            <AreaChart
              key={viewToken}
              data={chartData}
              range={viewToken !== 'NEAR' ? 'DAY' : undefined}
              symbol={tokens[viewToken]?.symbol ?? ''}
            />
          )}
        </div>
        <div className={styles.label}>Transactions</div>
        <Button
          variant="tertiary"
          className={styles.filter}
          onClick={filterClickHandler}
        >
          {sortAsc ? 'Less recent' : 'Most recent'}
          <Icon
            name="buttonArrowUp"
            className={classNames(styles.filterIcon, {
              [styles.rotate]: sortAsc,
            })}
          />
        </Button>
        <div className={styles.transactions}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {transactionsData
                .sort((a, b) =>
                  sortAsc
                    ? a.timestamp - b.timestamp
                    : b.timestamp - a.timestamp
                )
                .slice(
                  activePage * TRANSACTIONS_PER_PAGE,
                  (activePage + 1) * TRANSACTIONS_PER_PAGE
                )
                .map(
                  ({
                    type,
                    timestamp,
                    deposit,
                    date,
                    predecessorAccountId,
                    receiptId,
                    txHash,
                    token,
                  }) => {
                    const tokenData = get(tokens, token);

                    if (!tokenData) return null;

                    return (
                      <div
                        className={styles.row}
                        key={`${type}_${timestamp}_${deposit}_${receiptId}`}
                      >
                        <TransactionCard
                          tokenName={tokenData.symbol}
                          type={type}
                          deposit={formatYoktoValue(
                            deposit,
                            tokenData.decimals
                          )}
                          date={date}
                          txHash={txHash}
                          accountName={predecessorAccountId}
                        />
                      </div>
                    );
                  }
                )}
            </>
          )}
        </div>
        {pageCount > 0 ? (
          <div className={styles.pagination}>
            <Pagination
              key={viewToken}
              pageCount={pageCount}
              onPageActive={pageChangeHandler}
              onPageChange={pageChangeHandler}
            />
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${dao.id}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>Treasury</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          disableNewProposal={!isCanCreateProposals}
          onCreateProposalClick={toggleCreateProposal}
        />
        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          key={Object.keys(tokens).length}
          daoTokens={tokens}
          proposalVariant={ProposalVariant.ProposeTransfer}
          showFlag={false}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>
      <div className={styles.header}>
        <h1>Tokens</h1>
      </div>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          <DaoAddressLink daoAddress={dao.id} />
          <CopyButton text={dao.id} className={styles.icon} />
        </div>
      </div>
      <div className={styles.total}>
        <ChartCaption captions={captions} />
      </div>
      <div className={styles.tokens}>
        {Object.values(tokens)
          .sort(sorter)
          .map(({ icon, symbol, balance, id, price }) => (
            <TokenCard
              key={`${id}-${symbol}`}
              isActive={viewToken === id}
              symbol={symbol}
              onClick={() => {
                setActivePage(0);
                onFilterChange(id);
              }}
              icon={icon}
              balance={Number(balance)}
              totalValue={
                price
                  ? formatCurrency(parseFloat(balance) * Number(price))
                  : null
              }
            />
          ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default TokensPage;
