import React, { FC, useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import get from 'lodash/get';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import { DaoAddressLink } from 'components/DaoAddressLink';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ChartCaption } from 'components/AreaChartRenderer/components/chart-caption';
import { TokenCard } from 'components/cards/TokenCard';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Loader } from 'components/loader';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { TransactionCard } from 'components/cards/TransactionCard';
import { Pagination } from 'components/Pagination';

import {
  getAccumulatedTokenValue,
  sorter,
  useTokenFilteredData,
} from 'features/treasury/helpers';

import { formatCurrency } from 'utils/formatCurrency';
import { formatYoktoValue } from 'utils/format';

import { DaoContext } from 'types/context';
import { useDaoSettings } from 'context/DaoSettingsContext';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';

import { useDaoDashboardData } from 'astro_2.0/features/DaoDashboard/hooks';
import { useDaoCustomTokens } from 'context/DaoTokensContext';

import styles from './TokensPageContent.module.scss';

const AreaChart = dynamic(import('components/AreaChartRenderer'), {
  ssr: false,
});
const TRANSACTIONS_PER_PAGE = 10;

interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const TokensPageContent: FC<Props> = ({ daoContext }) => {
  const { dao } = daoContext;

  const flags = useFlags();

  const { t } = useTranslation();
  const { settings } = useDaoSettings();
  const { tokens } = useDaoCustomTokens();

  const daoHasGovernanceTokenConfigured =
    settings?.createGovernanceToken?.wizardCompleted;

  const {
    chartData,
    transactionsData,
    onFilterChange,
    viewToken,
    loading,
    error,
  } = useTokenFilteredData(tokens);

  const { chartData: nearChartData } = useDaoDashboardData();

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
        <Head>
          <title>Treasury</title>
        </Head>
        <div className={styles.chart}>
          {viewToken !== 'NEAR' && !!chartData.length && !loading && (
            <AreaChart
              key={viewToken}
              data={chartData}
              range={viewToken !== 'NEAR' ? 'DAY' : undefined}
              tokenName={tokens[viewToken]?.symbol ?? ''}
            />
          )}
          {viewToken === 'NEAR' && nearChartData && (
            <DashboardChart data={nearChartData} />
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
            transactionsData
              .sort((a, b) =>
                sortAsc ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
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

                  if (!tokenData) {
                    return null;
                  }

                  return (
                    <div
                      className={styles.row}
                      key={`${type}_${timestamp}_${deposit}_${receiptId}`}
                    >
                      <TransactionCard
                        tokenName={tokenData.symbol}
                        type={type}
                        deposit={formatYoktoValue(deposit, tokenData.decimals)}
                        date={date}
                        txHash={txHash}
                        accountName={predecessorAccountId}
                      />
                    </div>
                  );
                }
              )
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

  function renderCreateGovTokenButton() {
    if (flags.governanceToken && settings && !daoHasGovernanceTokenConfigured) {
      return (
        <Button
          capitalize
          className={styles.createGovToken}
          href={{
            pathname: CREATE_GOV_TOKEN_PAGE_URL,
            query: {
              dao: dao.id,
            },
          }}
        >
          {t('tokensPage.setupGovernanceToken')}
        </Button>
      );
    }

    return null;
  }

  return (
    <div className={styles.root}>
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
        {renderCreateGovTokenButton()}
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
