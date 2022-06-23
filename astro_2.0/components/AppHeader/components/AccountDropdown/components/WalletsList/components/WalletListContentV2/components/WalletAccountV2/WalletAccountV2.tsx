import cn from 'classnames';
import isNil from 'lodash/isNil';
import { useTranslation } from 'next-i18next';
import React, { FC, KeyboardEvent, MouseEvent, useMemo } from 'react';

import { WalletType } from 'types/config';
import { WalletAccount } from 'context/WalletContext/types';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { ListItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList/components/WalletListContentV2/components/ListItem';

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
  const { logout, currentWallet } = useWalletContext();

  const { active, account, switchAccountHandler, switchWalletHandler } = props;

  const { acc, walletType } = account;

  const rootClassName = cn({
    [styles.active]: active,
  });

  const switchAccount = useMemo(() => {
    const changeAccount = switchAccountHandler(acc);
    const changeWallet = switchWalletHandler(WalletType.NEAR);

    return async () => {
      if (!isNil(currentWallet) && currentWallet !== WalletType.NEAR) {
        await changeWallet();
      }

      changeAccount();
    };
  }, [acc, currentWallet, switchWalletHandler, switchAccountHandler]);

  const switchWallet = useMemo(() => switchWalletHandler(WalletType.SENDER), [
    switchWalletHandler,
  ]);

  function disconnect(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation();
    e.preventDefault();

    logout();
  }

  const switchAcc =
    walletType === WalletType.NEAR ? switchAccount : switchWallet;

  return (
    <ListItem onClick={switchAcc} className={rootClassName}>
      <div className={styles.statusDot} />
      <div className={styles.iconHolder}>
        <WalletIcon walletType={walletType} isSelected={false} />
      </div>

      <div className={styles.account}>{acc}</div>
      <CopyButton text={acc} className={styles.copyButton} />
      <div
        tabIndex={0}
        role="button"
        onClick={disconnect}
        onKeyPress={disconnect}
        className={styles.disconnect}
      >
        {t('header.disconnect')}
      </div>
    </ListItem>
  );
};
