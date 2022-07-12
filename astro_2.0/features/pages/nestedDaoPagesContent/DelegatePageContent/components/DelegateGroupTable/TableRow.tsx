import React, { FC } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';

import { DaoDelegation } from 'types/dao';

import { ActionsRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/ActionsRow';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { Button } from 'components/button/Button';
import { VotingPower } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/VotingPower';

import { kFormatter } from 'utils/format';
import { useDelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';
import { DATE_TIME_FORMAT } from 'constants/timeConstants';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';

import styles from './DelegateGroupTable.module.scss';

interface Props extends DaoDelegation {
  votingThreshold: string;
  decimals?: number;
  symbol?: string;
  isActive: boolean;
  actionContext?: 'Delegate' | 'Undelegate';
  onActionClick: (actionType: string | null) => void;
  availableBalance: number;
}

export const TableRow: FC<Props> = ({
  accountId,
  balance,
  votingThreshold,
  decimals,
  symbol,
  isActive,
  actionContext,
  onActionClick,
  availableBalance,
}) => {
  const progressPercent = (+balance * 100) / +votingThreshold;
  const formattedBalance = Number(balance).toFixed(0);

  const {
    nextActionTime,
    stakedBalance = 0,
    delegatedBalance = 0,
    memberBalance,
    delegateToUser,
  } = useDelegatePageContext();

  const actionsNotAvailable = nextActionTime && nextActionTime > new Date();
  const notEnoughStakedBalance =
    stakedBalance === 0 || Number(stakedBalance) <= delegatedBalance;
  const notEnoughDelegatedBalance =
    !delegateToUser ||
    !delegateToUser[accountId] ||
    (!!delegateToUser[accountId] && Number(delegateToUser[accountId]) === 0);
  const inactiveVotingPower = Number(balance) < Number(memberBalance);

  return (
    <>
      <div className={styles.row}>
        <div>{accountId}</div>
        <div>
          <Tooltip
            placement="top"
            className={styles.inline}
            overlay={
              inactiveVotingPower
                ? `Minimum number of tokens for member voting is ${memberBalance}`
                : 'Voting power'
            }
          >
            <FormattedNumericValue
              value={kFormatter(Number(formattedBalance))}
              suffix={symbol}
            />
            {inactiveVotingPower && (
              <Icon name="alertTriangle" className={styles.alert} />
            )}
          </Tooltip>
        </div>
        <div className={styles.desktop}>
          <VotingPower
            progressPercent={progressPercent}
            inactiveVotingPower={inactiveVotingPower}
          />
        </div>
        <div className={styles.inline}>
          <div className={styles.mobile}>
            <IconButton
              iconProps={{ width: 16 }}
              icon="buttonDeposit"
              disabled={actionsNotAvailable || notEnoughStakedBalance}
              className={cn(styles.widgetButton, {
                [styles.disabled]:
                  actionsNotAvailable || notEnoughStakedBalance,
              })}
              onClick={() =>
                onActionClick(actionContext !== 'Delegate' ? 'Delegate' : null)
              }
            />

            <IconButton
              iconProps={{ width: 16 }}
              icon="buttonWithdraw"
              disabled={+balance === 0 || notEnoughDelegatedBalance}
              className={cn(styles.widgetButton, {
                [styles.disabled]: +balance === 0 || notEnoughDelegatedBalance,
              })}
              onClick={() =>
                onActionClick(
                  actionContext !== 'Undelegate' ? 'Undelegate' : null
                )
              }
            />
          </div>
          <div className={styles.desktop}>
            <Tooltip
              placement="top"
              overlay={
                <span>
                  {actionsNotAvailable && nextActionTime
                    ? `Next action will be available at ${format(
                        nextActionTime,
                        DATE_TIME_FORMAT
                      )}`
                    : 'Delegate voting'}
                </span>
              }
            >
              <Button
                variant="transparent"
                size="small"
                capitalize
                className={cn(styles.controlButton, {
                  [styles.disabled]:
                    actionsNotAvailable || notEnoughStakedBalance,
                })}
                onClick={() =>
                  onActionClick(
                    actionContext !== 'Delegate' ? 'Delegate' : null
                  )
                }
                disabled={actionsNotAvailable || notEnoughStakedBalance}
              >
                Delegate
              </Button>
            </Tooltip>
            <Button
              variant="transparent"
              size="small"
              capitalize
              className={cn(styles.controlButton, {
                [styles.disabled]: +balance === 0 || notEnoughDelegatedBalance,
              })}
              disabled={+balance === 0 || notEnoughDelegatedBalance}
              onClick={() =>
                onActionClick(
                  actionContext !== 'Undelegate' ? 'Undelegate' : null
                )
              }
            >
              Undelegate
            </Button>
          </div>
        </div>
      </div>
      {isActive && (
        <ActionsRow
          key={actionContext}
          accountId={accountId}
          actionContext={actionContext}
          onActionClick={onActionClick}
          availableBalance={availableBalance}
          formattedBalance={formattedBalance}
          symbol={symbol}
          decimals={decimals}
        />
      )}
    </>
  );
};
