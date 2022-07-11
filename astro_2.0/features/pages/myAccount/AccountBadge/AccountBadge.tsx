import { VFC } from 'react';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

import { CopyButton } from 'astro_2.0/components/CopyButton';

import styles from './AccountBadge.module.scss';

export const AccountBadge: VFC = () => {
  const { accountId } = useWalletSelectorContext();

  return (
    <CopyButton
      text={accountId}
      className={styles.root}
      iconClassName={styles.icon}
      iconHolderClassName={styles.iconHolder}
    >
      <div className={styles.account}>{accountId}</div>
    </CopyButton>
  );
};
