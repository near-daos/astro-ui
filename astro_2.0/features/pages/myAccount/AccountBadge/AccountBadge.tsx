import { VFC } from 'react';

import { useWalletContext } from 'context/WalletContext';

import { CopyButton } from 'astro_2.0/components/CopyButton';

import styles from './AccountBadge.module.scss';

export const AccountBadge: VFC = () => {
  const { accountId } = useWalletContext();

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
