import React, { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import get from 'lodash/get';

import { useNearPrice } from 'hooks/useNearPrice';
import { formatCurrency } from 'utils/formatCurrency';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { DaoAddressLink } from 'components/DaoAddressLink';
import { CopyButton } from 'astro_2.0/components/CopyButton';

import { TokenCard } from 'components/cards/TokenCard';
import { TokenDeprecated } from 'types/token';

import { ChartCaption } from 'components/area-chart/components/chart-caption';
import { TransactionCard } from 'components/cards/TransactionCard';
import { Pagination } from 'components/Pagination';

import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { ProposalVariant } from 'types/proposal';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { Loader } from 'components/loader';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { DaoContext } from 'types/context';
import { NextPage } from 'next';
import {
  useTokenFilteredData,
  useTokensTransactions,
} from 'features/treasury/helpers';
import { formatYoktoValue } from 'helpers/format';

import styles from './Tokens.module.scss';

export interface TokensPageProps {
  daoContext: DaoContext;
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: NextPage<TokensPageProps> = ({
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
}) => {
  const totalValue = dao.funds ?? '0';
  const nearPrice = useNearPrice();
  const TRANSACTIONS_PER_PAGE = 10;
  const { tokens } = useDaoCustomTokens();

  const { data: receiptsByToken, loading } = useTokensTransactions(
    dao.id,
    tokens
  );

  const {
    chartData,
    transactionsData,
    onFilterChange,
    viewToken,
  } = useTokenFilteredData(receiptsByToken, tokens);

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const captions = useMemo(
    () => [
      {
        label: 'Total Value Locked',
        value: formatCurrency(parseFloat(totalValue) * nearPrice),
        currency: 'USD',
      },
    ],
    [nearPrice, totalValue]
  );

  const pageCount = Math.ceil(transactionsData.length / TRANSACTIONS_PER_PAGE);
  const [activePage, setActivePage] = useState(0);
  const [sortAsc, setSortAsc] = useState(false);
  const filterClickHandler = useCallback(() => {
    setSortAsc(!sortAsc);
  }, [sortAsc]);
  const pageChangeHandler = useCallback(({ selected }) => {
    setActivePage(selected);
  }, []);

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
      <div className={styles.chart}>
        {!!chartData.length && (
          <AreaChart
            key={viewToken}
            data={chartData}
            symbol={tokens[viewToken]?.symbol ?? ''}
          />
        )}
      </div>
      <div className={styles.tokens}>
        {Object.values(tokens).map(({ tokenId, icon, symbol, balance }) => (
          <TokenCard
            key={`${tokenId}-${symbol}`}
            isActive={
              symbol === 'NEAR' ? viewToken === 'NEAR' : viewToken === tokenId
            }
            symbol={symbol}
            onClick={() => onFilterChange(symbol === 'NEAR' ? 'NEAR' : tokenId)}
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

                  if (!tokenData) return null;

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
          </>
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
