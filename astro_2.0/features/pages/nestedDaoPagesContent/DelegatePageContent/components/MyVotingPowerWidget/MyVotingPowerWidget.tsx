import React, { FC, useMemo } from 'react';
import ContentLoader from 'react-content-loader';

import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';

import { DaoDelegation } from 'types/dao';
import { VotingPower } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/VotingPower';
import { useWalletContext } from 'context/WalletContext';
import { useDelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';

import styles from './MyVotingPowerWidget.module.scss';

interface Props {
  loading: boolean;
  data: DaoDelegation[] | undefined;
}

export const MyVotingPowerWidget: FC<Props> = ({ data, loading }) => {
  const { accountId } = useWalletContext();

  const { memberBalance, votingGoal, symbol } = useDelegatePageContext();

  const { balance } = useMemo(() => {
    const myDetails = data?.find(item => item.accountId === accountId);

    if (myDetails) {
      return {
        balance: myDetails.balance,
      };
    }

    return {
      balance: 0,
    };
  }, [accountId, data]);

  const progressPercent = (+balance * 100) / (votingGoal || 1);
  const inactiveVotingPower = Number(balance) < Number(memberBalance);

  return (
    <DelegatePageWidget
      title={`My voting power (${symbol})`}
      avatar="userAccount"
      className={styles.widgetWrapper}
      titleClassName={styles.title}
    >
      {loading ? (
        <ContentLoader height={28} width={80}>
          <rect x="0" y="0" width="80" height="28" />
        </ContentLoader>
      ) : (
        <>
          <span className={styles.combined}>
            <span className={styles.primaryValue}>
              {balance ? balance.toString() : '0'}/
            </span>
            <span className={styles.sub}>
              {votingGoal ? votingGoal.toString() : '0'}
            </span>
          </span>
          <div className={styles.powerWrapper}>
            <VotingPower
              showValue={false}
              className={styles.power}
              progressBarClassName={styles.progress}
              progressPercent={progressPercent}
              inactiveVotingPower={inactiveVotingPower}
            />
          </div>
        </>
      )}
    </DelegatePageWidget>
  );
};
