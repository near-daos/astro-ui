import cn from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { WalletType } from 'types/config';
import { WalletAccount } from 'context/WalletContext/types';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';

import { useWalletContext } from 'context/WalletContext';

import styles from './WalletAccountV2.module.scss';

interface WalletAccountProps {
  active: boolean;
  account: WalletAccount;
  switchWalletHandler: (wallet: WalletType) => () => void;
  switchAccountHandler: (account: string) => () => void;
}

export const WalletAccountV2: FC<WalletAccountProps> = props => {
  const { t } = useTranslation();
  const { currentWallet } = useWalletContext();

  const { active, account, switchAccountHandler, switchWalletHandler } = props;

  const { acc, walletType } = account;

  const rootClassName = cn(styles.root, {
    [styles.active]: active,
  });

  const switchAccount = useMemo(() => {
    const changeAccount = switchAccountHandler(acc);
    const changeWallet = switchWalletHandler(WalletType.NEAR);

    return async () => {
      if (currentWallet !== WalletType.NEAR) {
        await changeWallet();
      }

      changeAccount();
    };
  }, [acc, currentWallet, switchWalletHandler, switchAccountHandler]);

  const switchWallet = useMemo(() => switchWalletHandler(WalletType.SENDER), [
    switchWalletHandler,
  ]);

  const switchAcc =
    walletType === WalletType.NEAR ? switchAccount : switchWallet;

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={switchAcc}
      onKeyPress={switchAcc}
      className={rootClassName}
    >
      <div className={styles.statusDot} />
      <div className={styles.iconHolder}>
        <WalletIcon walletType={walletType} isSelected={false} />
      </div>

      <div className={styles.account}>{acc}</div>
      <CopyButton text={acc} />
      <div>{t('header.disconnect')}</div>
    </div>
  );
};
