import { VFC } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { CopyButton } from 'astro_2.0/components/CopyButton';

import styles from './AccountBadge.module.scss';

export const AccountBadge: VFC = () => {
  const { accountId } = useAuthContext();

  return (
    <div className={styles.root}>
      <div className={styles.account}>{accountId}</div>

      <CopyButton
        text={accountId}
        className={styles.copyBtn}
        iconClassName={styles.icon}
        iconHolderClassName={styles.iconHolder}
      />
    </div>
  );
};
