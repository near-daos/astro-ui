import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import get from 'lodash/get';

import { useAuthContext } from 'context/AuthContext';
import { useNearPrice } from 'hooks/useNearPrice';
import { formatCurrency } from 'utils/formatCurrency';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { DaoAddressLink } from 'components/dao-address';
import { CopyButton } from 'astro_2.0/components/CopyButton';

import { TokenCard } from 'components/cards/token-card';
import { TokenDeprecated } from 'types/token';

import { ChartCaption } from 'components/area-chart/components/chart-caption';
import { ChartData } from 'types/chart';

import { TransactionCard } from 'components/cards/transaction-card';
import { Receipt } from 'types/transaction';
import { Pagination } from 'components/pagination';

import styles from 'pages/dao/[dao]/treasury/tokens/tokens.module.scss';
import { DAO } from 'types/dao';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { Proposal, ProposalVariant } from 'types/proposal';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { useAuthCheck } from 'astro_2.0/features/Auth';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { formatYoktoValue } from 'helpers/format';

export interface TokensPageProps {
  data: {
    chartData: ChartData[];
    totalValue: string;
    receipts: Record<string, Receipt[]>;
    dao: DAO;
    policyAffectsProposals: Proposal[];
  };
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  data: { chartData, totalValue, receipts, dao, policyAffectsProposals },
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const nearPrice = useNearPrice();
  const { accountId } = useAuthContext();
  const TRANSACTIONS_PER_PAGE = 10;
  const { tokens } = useDaoCustomTokens();
  const [viewToken, setViewToken] = useState('NEAR');
  const receiptsData = receipts[viewToken] ?? [];

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const handleClick = useAuthCheck(() => toggleCreateProposal(), [
    toggleCreateProposal,
  ]);

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

  // TODO - existing receipts endpoint doesn't support pagination yet
  const pageCount = Math.round(receiptsData.length / TRANSACTIONS_PER_PAGE);
  const [activePage, setActivePage] = useState(0);
  const [sortAsc, setSortAsc] = useState(false);
  const filterClickHandler = useCallback(() => {
    setSortAsc(!sortAsc);
  }, [sortAsc]);
  const pageChangeHandler = useCallback(({ selected }) => {
    setActivePage(selected);
  }, []);

  const refreshData = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>Treasury</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          disableNewProposal={!!policyAffectsProposals.length}
          onCreateProposalClick={toggleCreateProposal}
        />
        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          proposalVariant={ProposalVariant.ProposeTransfer}
          showFlag={false}
          onCreate={isSuccess => {
            if (isSuccess) {
              refreshData();
              toggleCreateProposal();
            }
          }}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>
      <div className={styles.header}>
        <h1>Tokens</h1>
        <Button
          variant="black"
          size="small"
          onClick={handleClick}
          disabled={!!policyAffectsProposals.length}
        >
          Propose Payout
        </Button>
      </div>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          <DaoAddressLink daoAddress={daoId} />
          <CopyButton text={daoId} className={styles.icon} />
        </div>
      </div>
      <div className={styles.total}>
        <ChartCaption captions={captions} />
      </div>
      <div className={styles.chart}>
        {viewToken === 'NEAR' && <AreaChart data={chartData} />}
      </div>
      <div className={styles.tokens}>
        {Object.values(tokens).map(({ tokenId, icon, symbol, balance }) => (
          <TokenCard
            key={`${tokenId}-${symbol}`}
            isActive={
              symbol === 'NEAR' ? viewToken === 'NEAR' : viewToken === tokenId
            }
            symbol={symbol}
            onClick={() => setViewToken(symbol === 'NEAR' ? 'NEAR' : tokenId)}
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
        {receiptsData
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
