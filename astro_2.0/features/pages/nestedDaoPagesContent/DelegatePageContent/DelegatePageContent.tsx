import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ContentLoader from 'react-content-loader';
import { format } from 'date-fns';
import cn from 'classnames';

import { SearchInput } from 'astro_2.0/components/SearchInput';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/button/Button';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { DelegateGroupTable } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable';
import { MyBalanceWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/MyBalanceWidget';
import { VotingThresholdWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/VotingThresholdWidget';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { GoalChart } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/GoalChart';
import { QuorumErrorWarning } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/QuorumErrorWarning';

import {
  useDelegatePageData,
  useVotingPolicyDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';

import { DaoContext } from 'types/context';
import {
  getSortOptions,
  getVotingGoal,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import useQuery from 'hooks/useQuery';

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
  const [showGoalChart, setShowGoalChart] = useState(false);

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
  const {
    threshold: votingThreshold,
    balance,
    quorum,
  } = useVotingPolicyDetails(daoContext.dao);
  const canCreateProposal =
    daoContext.userPermissions.isCanCreatePolicyProposals &&
    daoContext.policyAffectsProposals.length === 0;

  const votingGoal = getVotingGoal(
    Number(votingThreshold),
    Number(totalSupply ?? 0),
    Number(quorum ?? 0)
  );

  const handleCreateNewProposal = useCallback(() => {
    if (toggleCreateProposal) {
      toggleCreateProposal({
        proposalVariant: ProposalVariant.ProposeUpdateVotePolicyToWeightVoting,
        initialValues: {
          threshold: votingThreshold,
          quorum,
          balance,
        },
      });
    }
  }, [balance, quorum, toggleCreateProposal, votingThreshold]);

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

  const isQuorumError = Number(totalSupply) < Number(votingGoal);
  const actionsNotAvailable =
    delegateByUser && delegateByUser?.nextActionTime > new Date();

  const contextValue = useMemo(() => {
    return {
      daoName: daoContext.dao.name,
      stakedBalance: delegateByUser?.stakedBalance,
      delegatedBalance: delegateByUser?.delegatedBalance,
      contractAddress: tokenDetails?.contractAddress,
      nextActionTime: delegateByUser?.nextActionTime,
      memberBalance: balance,
      delegateToUser: delegateByUser?.delegatedToUser,
    };
  }, [
    balance,
    daoContext.dao.name,
    delegateByUser?.delegatedBalance,
    delegateByUser?.delegatedToUser,
    delegateByUser?.nextActionTime,
    delegateByUser?.stakedBalance,
    tokenDetails?.contractAddress,
  ]);

  return (
    <DelegatePageContext.Provider value={contextValue}>
      <div className={styles.root}>
        <h1>Delegate Voting</h1>
        <div
          className={cn(styles.widgets, {
            [styles.widgetExpanded]: showGoalChart,
          })}
        >
          <MyBalanceWidget
            loading={loadingDelegateByUser}
            decimals={tokenDetails?.decimals}
            delegatedBalance={delegateByUser?.delegatedBalance}
            stakedBalance={delegateByUser?.stakedBalance}
            symbol={tokenDetails?.symbol}
            availableBalance={tokenDetails?.balance}
          />
          <DelegatePageWidget
            title={`Total Delegated Balance (${tokenDetails?.symbol})`}
          >
            {loadingTotalSupply ? (
              <ContentLoader height={28} width={80}>
                <rect x="0" y="0" width="80" height="28" />
              </ContentLoader>
            ) : (
              <FormattedNumericValue
                value={totalSupply ? Number(totalSupply) : 0}
                valueClassName={styles.primaryValue}
                suffixClassName={styles.secondaryValue}
              />
            )}
          </DelegatePageWidget>
          <VotingThresholdWidget
            loading={loadingDelegateByUser}
            value={votingGoal}
            disabled={!canCreateProposal}
            showGoalChart={showGoalChart}
            onToggleChart={() => setShowGoalChart(!showGoalChart)}
            onEdit={handleCreateNewProposal}
          />
        </div>
        {showGoalChart && (
          <div className={styles.goalChartWrapper}>
            <GoalChart
              threshold={Number(votingThreshold ?? 0)}
              quorum={Number(quorum ?? 0)}
              totalDelegated={Number(totalSupply ?? 0)}
            />
          </div>
        )}
        {isQuorumError && (
          <QuorumErrorWarning onClick={handleCreateNewProposal} />
        )}
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
                  actionsNotAvailable ||
                  Number(delegateByUser?.stakedBalance || 0) === 0
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
