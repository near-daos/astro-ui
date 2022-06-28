import React, { FC } from 'react';
import cn from 'classnames';
import { UserDelegateDetails } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';

import { Button } from 'components/button/Button';

import { formatYoktoValue, kFormatter } from 'utils/format';

import styles from './DelegateGroupTable.module.scss';

interface Props extends UserDelegateDetails {
  votingThreshold: number;
  decimals?: number;
  symbol?: string;
  isActive: boolean;
  actionContext?: 'Delegate' | 'Undelegate';
  onActionClick: (actionType: string) => void;
  availableBalance: number;
}

export const TableRow: FC<Props> = ({
  accountId,
  delegatedBalance,
  votingThreshold,
  decimals,
  symbol,
  isActive,
  actionContext,
  onActionClick,
  availableBalance,
}) => {
  const progressPercent = (delegatedBalance * 100) / votingThreshold;
  const formattedBalance = formatYoktoValue(
    delegatedBalance?.toString(),
    decimals
  );

  return (
    <>
      <div className={styles.row}>
        <div className={styles.dataCell}>{accountId}</div>
        <div className={styles.dataCell}>
          <FormattedNumericValue
            value={kFormatter(Number(formattedBalance))}
            suffix={symbol}
            valueClassName={styles.primaryValue}
            suffixClassName={styles.secondaryValue}
          />
        </div>
        <div className={styles.dataCell}>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressValue}>
              {progressPercent.toFixed()}%
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className={cn(styles.inline, styles.dataCell)}>
          <Button
            variant="transparent"
            size="small"
            capitalize
            className={styles.controlButton}
            onClick={() => onActionClick('Delegate')}
          >
            Delegate
          </Button>
          <Button
            variant="transparent"
            size="small"
            capitalize
            className={styles.controlButton}
            onClick={() => onActionClick('Undelegate')}
          >
            Undelegate
          </Button>
        </div>
      </div>
      {isActive && (
        <div className={styles.actionsRow}>
          <div className={styles.dataCell}>{actionContext}</div>
          <div className={styles.dataCell}>
            <span>Available:</span>
            <span>
              {actionContext === 'Delegate'
                ? kFormatter(availableBalance)
                : formattedBalance}
            </span>
            <span>{symbol}</span>
          </div>
          <div className={styles.dataCell}>input</div>
          <Button size="small" capitalize>
            {actionContext}
          </Button>
        </div>
      )}
    </>
  );
};
