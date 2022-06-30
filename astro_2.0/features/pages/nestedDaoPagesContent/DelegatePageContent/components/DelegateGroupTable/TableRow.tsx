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

  const { nextActionTime } = useDelegatePageContext();

  const actionsNotAvailable = nextActionTime && nextActionTime > new Date();

  return (
    <>
      <div className={styles.row}>
        <div>{accountId}</div>
        <div>
          <FormattedNumericValue
            value={kFormatter(Number(formattedBalance))}
            suffix={symbol}
            valueClassName={styles.primaryValue}
            suffixClassName={styles.secondaryValue}
          />
        </div>
        <div>
          <VotingPower progressPercent={progressPercent} />
        </div>
        <div className={styles.inline}>
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
                [styles.disabled]: actionsNotAvailable,
              })}
              onClick={() =>
                onActionClick(actionContext !== 'Delegate' ? 'Delegate' : null)
              }
              disabled={actionsNotAvailable}
            >
              Delegate
            </Button>
          </Tooltip>
          <Button
            variant="transparent"
            size="small"
            capitalize
            className={cn(styles.controlButton, {
              [styles.disabled]: +balance === 0,
            })}
            disabled={+balance === 0}
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
