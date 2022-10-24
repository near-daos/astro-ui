import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ContentLoader from 'react-content-loader';
import { format } from 'date-fns';
import cn from 'classnames';

import { Icon } from 'components/Icon';
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
import { MyVotingPowerWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/MyVotingPowerWidget';

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
    loadingTokenDetails,
    totalSupply,
    tokenDetails,
    handleSearch,
    handleReset,
    delegateByUser,
    data,
  } = useDelegatePageData(daoContext.dao);

  const loading =
    loadingDelegateByUser || loadingTotalSupply || loadingTokenDetails;

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
          contractAddress: tokenDetails?.contractAddress,
          details: t('delegateVoting.policyDescription'),
        },
      });
    }
  }, [
    balance,
    quorum,
    t,
    toggleCreateProposal,
    tokenDetails?.contractAddress,
    votingThreshold,
  ]);

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
      symbol: tokenDetails?.symbol,
      decimals: tokenDetails?.decimals,
      votingGoal,
    };
  }, [
    votingGoal,
    balance,
    daoContext.dao.name,
    delegateByUser?.delegatedBalance,
    delegateByUser?.nextActionTime,
    delegateByUser?.stakedBalance,
    tokenDetails?.contractAddress,
    tokenDetails?.decimals,
    tokenDetails?.symbol,
  ]);

  return (
    <DelegatePageContext.Provider value={contextValue}>
      <div className={styles.root}>
        <h1>Delegate Voting</h1>
        <div className={styles.topWidgets}>
          <MyVotingPowerWidget loading={loading} data={data} />
        </div>
        <div
          className={cn(styles.widgets, {
            [styles.widgetExpanded]: showGoalChart,
          })}
        >
          <MyBalanceWidget
            loading={loading}
            decimals={tokenDetails?.decimals}
            delegatedBalance={delegateByUser?.delegatedBalance}
            stakedBalance={delegateByUser?.stakedBalance}
            symbol={tokenDetails?.symbol}
            availableBalance={tokenDetails?.balance}
            actionsNotAvailable={actionsNotAvailable}
            nextActionTime={delegateByUser?.nextActionTime}
          />
          <DelegatePageWidget
            title={`Total Delegated Balance (${tokenDetails?.symbol})`}
          >
            {loading ? (
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
            loading={loading}
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
              balance={Number(balance ?? 0)}
            />
          </div>
        )}
        {isQuorumError && (
          <QuorumErrorWarning onClick={handleCreateNewProposal} />
        )}
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.title}>Delegate group</div>
            <div className={cn(styles.search, styles.desktop)}>
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
              className={styles.add}
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
                className={styles.addButton}
                capitalize
                size="small"
                disabled={
                  actionsNotAvailable ||
                  Number(delegateByUser?.stakedBalance || 0) === 0
                }
                onClick={() => setAddNewMemeberMode(!addNewMemberMode)}
              >
                <Icon name="plus" width={18} className={styles.buttonIcon} />
                Add member
              </Button>
            </Tooltip>
          </div>
          <DelegateGroupTable
            votingThreshold={votingThreshold}
            tokenDetails={tokenDetails}
            data={data}
            loading={loading}
            addMemberMode={addNewMemberMode}
            onAddMember={() => setAddNewMemeberMode(false)}
          />
        </div>
      </div>
    </DelegatePageContext.Provider>
  );
};
