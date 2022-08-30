import React, { FC, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { format } from 'date-fns';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { ActionPanel } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/MyBalanceWidget/ActionPanel';

import { DATE_TIME_FORMAT } from 'constants/timeConstants';

import styles from './MyBalanceWidget.module.scss';

interface Props {
  loading: boolean;
  delegatedBalance?: number;
  availableBalance?: number;
  stakedBalance?: string;
  decimals?: number;
  symbol?: string;
  actionsNotAvailable?: boolean;
  nextActionTime?: Date;
}

export const MyBalanceWidget: FC<Props> = ({
  loading,
  delegatedBalance,
  availableBalance,
  stakedBalance,
  decimals,
  symbol,
  actionsNotAvailable,
  nextActionTime,
}) => {
  const [context, setContext] = useState<'stake' | 'unstake' | null>(null);

  return (
    <>
      <DelegatePageWidget
        title={`My delegated / staked balance (${symbol})`}
        // avatar="userAccount"
        className={styles.widgetWrapper}
        titleClassName={styles.title}
      >
        {loading ? (
          <ContentLoader height={28} width={80}>
            <rect x="0" y="0" width="80" height="28" />
          </ContentLoader>
        ) : (
          <div className={styles.root}>
            <div className={styles.depositWidget}>
              <span className={styles.combined}>
                <span className={styles.primaryValue}>
                  {delegatedBalance ? delegatedBalance.toString() : '0'}/
                </span>
                <span className={styles.sub}>
                  {stakedBalance ? stakedBalance.toString() : '0'}
                </span>
              </span>

              <span className={cn(styles.alignRight, styles.desktop)}>
                <Tooltip overlay={<span>Stake</span>} placement="top">
                  <IconButton
                    iconProps={{ width: 16 }}
                    icon="buttonDeposit"
                    disabled={availableBalance === 0}
                    className={styles.widgetButton}
                    onClick={() => setContext('stake')}
                  />
                </Tooltip>
                <Tooltip
                  overlay={
                    <span>
                      {actionsNotAvailable && nextActionTime
                        ? `Next action will be available at ${format(
                            nextActionTime,
                            DATE_TIME_FORMAT
                          )}`
                        : 'Unstake'}
                    </span>
                  }
                  placement="top"
                >
                  <IconButton
                    iconProps={{ width: 16 }}
                    icon="buttonWithdraw"
                    disabled={(stakedBalance || 0) === 0 || actionsNotAvailable}
                    className={styles.widgetButton}
                    onClick={() => setContext('unstake')}
                  />
                </Tooltip>
              </span>
            </div>

            {context && (
              <ActionPanel
                key={context}
                context={context}
                delegatedBalance={delegatedBalance ?? 0}
                availableBalance={availableBalance ?? 0}
                stakedBalance={stakedBalance ? Number(stakedBalance) : 0}
                symbol={symbol}
                decimals={decimals}
                onUpdateContext={val => setContext(val)}
              />
            )}
          </div>
        )}
      </DelegatePageWidget>
      <div className={cn(styles.controlBlock, styles.mobile)}>
        <Button
          capitalize
          variant="green"
          size="flex"
          disabled={availableBalance === 0}
          onClick={() => setContext('stake')}
          className={styles.controlBlockButton}
        >
          <>
            <Icon
              name="buttonDeposit"
              width={18}
              className={styles.buttonIcon}
            />
            Stake
          </>
        </Button>
        <Button
          capitalize
          disabled={(stakedBalance || 0) === 0}
          variant="secondary"
          size="flex"
          onClick={() => setContext('unstake')}
          className={cn(styles.controlBlockButton, styles.secondaryGreen)}
        >
          <>
            <Icon
              name="buttonWithdraw"
              width={16}
              className={styles.buttonIcon}
            />
            Unstake
          </>
        </Button>
      </div>
    </>
  );
};
