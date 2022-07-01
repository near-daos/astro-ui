import React, { FC, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ContentLoader from 'react-content-loader';

import { SearchInput } from 'astro_2.0/components/SearchInput';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/button/Button';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { DelegateGroupTable } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable';
import { MyBalanceWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/MyBalanceWidget';
import { VotingThresholdWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/VotingThresholdWidget';
import { useWalletContext } from 'context/WalletContext';

import { useDelegatePageData } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';

import { DaoContext } from 'types/context';
import { getSortOptions } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import useQuery from 'hooks/useQuery';
import { formatYoktoValue, kFormatter } from 'utils/format';

import styles from './DelegatePageContent.module.scss';

interface Props {
  daoContext: DaoContext;
}

export const DelegatePageContent: FC<Props> = ({ daoContext }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { query } = useQuery<{ sort: string }>();
  const { sort } = query;
  const { accountId } = useWalletContext();

  const {
    loadingDelegateByUser,
    loadingTotalSupply,
    totalSupply,
    tokenDetails,
    handleSearch,
    handleReset,
    searching,
    delegateByUser,
  } = useDelegatePageData(daoContext.dao);

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        sort: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: false, scroll: false }
      );
    },
    [query, router]
  );

  const sortOptions = getSortOptions(t);
  const currentUserDetails = delegateByUser?.find(
    item => item.accountId === accountId
  );

  return (
    <div className={styles.root}>
      <h1>Delegate Voting</h1>
      <div className={styles.widgets}>
        <DelegatePageWidget title="Total Delegated Balance">
          {loadingTotalSupply ? (
            <ContentLoader height={28}>
              <rect x="0" y="0" width="180" height="28" />
            </ContentLoader>
          ) : (
            <FormattedNumericValue
              value={kFormatter(
                totalSupply
                  ? Number(
                      formatYoktoValue(totalSupply, tokenDetails?.decimals)
                    )
                  : 0
              )}
              suffix={tokenDetails?.symbol}
              valueClassName={styles.primaryValue}
              suffixClassName={styles.secondaryValue}
            />
          )}
        </DelegatePageWidget>
        <MyBalanceWidget
          loading={loadingDelegateByUser}
          decimals={tokenDetails?.decimals}
          delegatedBalance={currentUserDetails?.delegatedBalance}
          stakedBalance={currentUserDetails?.stakedBalance}
        />
        <VotingThresholdWidget
          loading={loadingDelegateByUser}
          value={
            totalSupply
              ? Number(formatYoktoValue(totalSupply, tokenDetails?.decimals))
              : 0
          }
          suffix={tokenDetails?.symbol}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.title}>Delegate group</div>

          <div className={styles.search}>
            <SearchInput
              onSubmit={handleSearch}
              loading={searching}
              placeholder="Search by name"
              onClose={handleReset}
              showResults={false}
            />
          </div>

          <div className={styles.sorting}>
            <span className={styles.label}>Sorting by:</span>
            <Dropdown
              options={sortOptions}
              value={sort ?? sortOptions[0].value}
              defaultValue={sort ?? sortOptions[0].value}
              onChange={handleSort}
              menuClassName={styles.menu}
            />
          </div>

          <Button variant="secondary" size="small" capitalize>
            Add member
          </Button>
        </div>
        <DelegateGroupTable
          votingThreshold={300000}
          tokenDetails={tokenDetails}
          data={delegateByUser}
          loading={loadingDelegateByUser}
        />
      </div>
    </div>
  );
};
