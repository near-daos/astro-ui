import React, { FC, useMemo, useState } from 'react';
import Head from 'next/head';
import get from 'lodash/get';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { DaoAddressLink } from 'components/DaoAddressLink';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ChartCaption } from 'components/AreaChartRenderer/components/chart-caption';
import { TokenCard } from 'components/cards/TokenCard';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Loader } from 'components/loader';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { Button } from 'components/button/Button';
import { TransactionCard } from 'components/cards/TransactionCard';
import { SortMenu } from 'astro_3.0/components/SortMenu';

import { getAccumulatedTokenValue, sorter } from 'features/treasury/helpers';

import { formatCurrency } from 'utils/formatCurrency';
import { formatYoktoValue } from 'utils/format';

import { DaoContext } from 'types/context';
import { useDaoSettings } from 'context/DaoSettingsContext';
import { useDaoCustomTokens } from 'context/DaoTokensContext';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';

import { useTransactionsDailyBalance } from 'services/ApiService/hooks/useTransctionsDailyBalance';
import { useTransactionsFeed } from 'astro_3.0/features/TokensPageContentV2/hooks';
import { getSortOptions } from './helpers';

import styles from './TokensPageContentV2.module.scss';

interface Props {
  daoContext: DaoContext;
}

export const TokensPageContentV2: FC<Props> = ({ daoContext }) => {
  const { dao } = daoContext;

  const flags = useFlags();

  const { t } = useTranslation();
  const { settings } = useDaoSettings();
  const { tokens } = useDaoCustomTokens();

  const [viewToken, setViewToken] = useState('NEAR');

  const daoHasGovernanceTokenConfigured =
    settings?.createGovernanceToken?.wizardCompleted;

  const {
    transactionsData,
    dataLength,
    hasMore,
    handleLoadMore,
    isValidating,
  } = useTransactionsFeed(viewToken);

  const { data } = useTransactionsDailyBalance(viewToken);

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

  function renderContent() {
    if (!dataLength && isValidating) {
      return <Loader className={styles.requestStatus} />;
    }

    if (!dataLength) {
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
          {data && <DashboardChart data={data} key={viewToken} />}
        </div>
        <div className={styles.label}>Transactions</div>
        <SortMenu sortFieldName="sort" sortOptions={getSortOptions(t)} />
        <div className={styles.transactions}>
          <InfiniteScroll
            dataLength={dataLength}
            next={handleLoadMore}
            hasMore={hasMore}
            loader={<h4 className={styles.loading}>{t('loading')}...</h4>}
            style={{ overflow: 'initial' }}
            endMessage={
              isValidating ? null : (
                <p className={styles.loading}>
                  <b>{t('youHaveSeenItAll')}</b>
                </p>
              )
            }
          >
            {transactionsData.data.map(
              ({
                type,
                timestamp,
                deposit,
                receiptId,
                txHash,
                predecessorAccountId,
                token,
                date,
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
            )}
          </InfiniteScroll>
        </div>
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
        <div className={styles.label}>Tokens</div>
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
                setViewToken(id);
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
