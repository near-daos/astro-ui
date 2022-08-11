import React, { FC } from 'react';

import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { useDaoCustomTokens } from 'context/DaoTokensContext';

import styles from './DaoLowBalanceWarning.module.scss';

export const DaoLowBalanceWarning: FC = () => {
  const { tokens } = useDaoCustomTokens();

  const showLowBalanceWarning =
    tokens?.NEAR?.balance && Number(tokens?.NEAR?.balance) < 5;

  if (!showLowBalanceWarning) {
    return null;
  }

  return (
    <DaoWarning
      content={
        <>
          <div className={styles.title}>Error</div>
          <div className={styles.text}>
            Your available balance is too low to perform any actions on your
            account. Please send Near to your account and then try again.
          </div>
        </>
      }
      className={styles.warningWrapper}
    />
  );
};
