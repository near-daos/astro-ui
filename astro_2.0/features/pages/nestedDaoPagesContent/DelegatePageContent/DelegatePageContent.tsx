import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ContentLoader from 'react-content-loader';
import { format } from 'date-fns';

import { SearchInput } from 'astro_2.0/components/SearchInput';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/button/Button';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { DelegateGroupTable } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable';
import { MyBalanceWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/MyBalanceWidget';
import { VotingThresholdWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/VotingThresholdWidget';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

import {
  useDelegatePageData,
  useVotingThreshold,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';

import { DaoContext } from 'types/context';
import { getSortOptions } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import useQuery from 'hooks/useQuery';
import { kFormatter } from 'utils/format';

import { DelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { DATE_TIME_FORMAT } from 'constants/timeConstants';
import { ProposalVariant } from 'types/proposal';

import styles from './DelegatePageContent.module.scss';

interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const DelegatePageContent: FC<Props> = ({
  daoContext,
  toggleCreateProposal,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { query } = useQuery<{ sort: string }>();
  const { sort } = query;
  const [addNewMemberMode, setAddNewMemeberMode] = useState(false);

  const {
    loadingDelegateByUser,
    loadingTotalSupply,
    totalSupply,
    tokenDetails,
    handleSearch,
    handleReset,
    delegateByUser,
    data,
  } = useDelegatePageData(daoContext.dao);
  const votingThreshold = useVotingThreshold(daoContext.dao);

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
  const actionsNotAvailable =
    delegateByUser && delegateByUser?.nextActionTime > new Date();

  const contextValue = useMemo(() => {
    return {
      daoName: daoContext.dao.name,
      stakedBalance: delegateByUser?.stakedBalance,
      delegatedBalance: delegateByUser?.delegatedBalance,
      contractAddress: tokenDetails?.contractAddress,
      nextActionTime: delegateByUser?.nextActionTime,
    };
  }, [
    daoContext.dao.name,
    delegateByUser?.delegatedBalance,
    delegateByUser?.nextActionTime,
    delegateByUser?.stakedBalance,
    tokenDetails?.contractAddress,
  ]);

  return (
    <DelegatePageContext.Provider value={contextValue}>
      <div className={styles.root}>
        <h1>Delegate Voting</h1>
        <div className={styles.widgets}>
          <MyBalanceWidget
            loading={loadingDelegateByUser}
            decimals={tokenDetails?.decimals}
            delegatedBalance={delegateByUser?.delegatedBalance}
            stakedBalance={delegateByUser?.stakedBalance}
            symbol={tokenDetails?.symbol}
            availableBalance={tokenDetails?.balance}
          />
          <DelegatePageWidget
            title="Total Delegated Balance"
            className={styles.secondaryWidget}
          >
            {loadingTotalSupply ? (
              <ContentLoader height={28} width={80}>
                <rect x="0" y="0" width="80" height="28" />
              </ContentLoader>
            ) : (
              <FormattedNumericValue
                value={kFormatter(totalSupply ? Number(totalSupply) : 0)}
                suffix={tokenDetails?.symbol}
                valueClassName={styles.primaryValue}
                suffixClassName={styles.secondaryValue}
              />
            )}
          </DelegatePageWidget>
          <VotingThresholdWidget
            loading={loadingDelegateByUser}
            value={Number(votingThreshold)}
            suffix={tokenDetails?.symbol}
            onEdit={() => {
              if (toggleCreateProposal) {
                toggleCreateProposal({
                  proposalVariant:
                    ProposalVariant.ProposeUpdateVotePolicyToWeightVoting,
                  initialValues: {
                    threshold: votingThreshold,
                  },
                });
              }
            }}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.title}>Delegate group</div>
            <div className={styles.search}>
              <SearchInput
                onSubmit={handleSearch}
                loading={false}
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
            <Tooltip
              placement="top"
              overlay={
                <span>
                  {actionsNotAvailable && delegateByUser
                    ? `Next action will be available at ${format(
                        delegateByUser?.nextActionTime,
                        DATE_TIME_FORMAT
                      )}`
                    : 'Add member and delegate voting'}
                </span>
              }
            >
              <Button
                variant="secondary"
                size="small"
                capitalize
                disabled={
                  delegateByUser && delegateByUser?.nextActionTime > new Date()
                }
                onClick={() => setAddNewMemeberMode(!addNewMemberMode)}
              >
                Add member
              </Button>
            </Tooltip>
          </div>
          <DelegateGroupTable
            votingThreshold={votingThreshold}
            tokenDetails={tokenDetails}
            data={data}
            loading={loadingDelegateByUser}
            addMemberMode={addNewMemberMode}
            onAddMember={() => setAddNewMemeberMode(false)}
          />
        </div>
      </div>
    </DelegatePageContext.Provider>
  );
};
