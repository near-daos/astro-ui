import React, { FC } from 'react';
import ContentLoader from 'react-content-loader';

import { IconButton } from 'components/button/IconButton';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/DelegatePageContent.module.scss';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { formatYoktoValue } from 'utils/format';

interface Props {
  loading: boolean;
  delegatedBalance?: number;
  stakedBalance?: string;
  decimals?: number;
}

export const MyBalanceWidget: FC<Props> = ({
  loading,
  delegatedBalance,
  stakedBalance,
  decimals,
}) => {
  return (
    <DelegatePageWidget title="My delegated / staked balance">
      {loading ? (
        <ContentLoader height={28}>
          <rect x="0" y="0" width="180" height="28" />
        </ContentLoader>
      ) : (
        <div className={styles.depositWidget}>
          <span className={styles.primaryValue}>
            {formatYoktoValue(
              delegatedBalance ? delegatedBalance.toString() : '0',
              decimals
            )}
            /
          </span>
          <span className={styles.sub}>
            {formatYoktoValue(
              stakedBalance ? stakedBalance.toString() : '0',
              decimals
            )}
          </span>

          <span className={styles.alignRight}>
            <Tooltip overlay={<span>Stake</span>} placement="top">
              <IconButton
                iconProps={{ width: 16 }}
                icon="buttonDeposit"
                className={styles.widgetButton}
              />
            </Tooltip>
            <Tooltip overlay={<span>Unstake</span>} placement="top">
              <IconButton
                iconProps={{ width: 16 }}
                icon="buttonWithdraw"
                className={styles.widgetButton}
              />
            </Tooltip>
          </span>
        </div>
      )}
    </DelegatePageWidget>
  );
};
