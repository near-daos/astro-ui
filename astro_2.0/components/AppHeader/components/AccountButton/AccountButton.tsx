import cn from 'classnames';
import React, { FC, useCallback, useRef, useState } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { Icon } from 'components/Icon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { WalletType } from 'types/config';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletIcon';
import { useModal } from 'components/modal';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletSelectionModal';
import { WalletsList } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletsList';

import styles from './AccountButton.module.scss';

export const AccountButton: FC = () => {
  const {
    login,
    logout,
    accountId,
    nearService,
    connectionInProgress,
    switchAccount,
    switchWallet,
    availableNearWalletAccounts,
  } = useAuthContext();

  const [open, setOpen] = useState(false);

  const [showModal] = useModal(WalletSelectionModal, {
    signIn: walletType => login(walletType),
  });

  const switchAccountHandler = useCallback(
    (account: string) => () => {
      switchAccount(WalletType.NEAR, account);
    },
    [switchAccount]
  );

  const switchWalletHandler = useCallback(
    (wallet: WalletType) => async () => {
      await switchWallet(wallet);
      setOpen(false);
    },
    [switchWallet]
  );

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const ref = useRef(null);

  function render() {
    if (!accountId) {
      return (
        <WalletIcon
          walletType={WalletType.NEAR}
          isSelected={false}
          showLoader={connectionInProgress}
          onClick={showModal}
        />
      );
    }

    return (
      <GenericDropdown
        isOpen={open}
        onOpenUpdate={setOpen}
        parent={
          <div
            className={cn(styles.accountButton, {
              [styles.disabled]: connectionInProgress,
            })}
          >
            <WalletIcon
              showLoader={connectionInProgress}
              walletType={nearService?.getWalletType() ?? WalletType.NEAR}
              isSelected={false}
            />
            <span className={styles.accountId}>{accountId}</span>
            <Icon
              name="buttonArrowDown"
              className={cn(styles.controlIcon, { [styles.open]: open })}
            />
          </div>
        }
        options={{
          placement: 'bottom-end',
        }}
      >
        <>
          {nearService && (
            <WalletsList
              logoutHandler={logout}
              availableWallets={nearService.availableWallets()}
              availableNearAccounts={availableNearWalletAccounts}
              selectedWallet={nearService.getWalletType()}
              switchAccountHandler={switchAccountHandler}
              switchWalletHandler={switchWalletHandler}
              closeDropdownHandler={closeDropdown}
            />
          )}
          <AppFooter mobile className={styles.footer} onClick={closeDropdown} />
        </>
      </GenericDropdown>
    );
  }

  return (
    <div
      className={cn(styles.root, {
        [styles.disabled]: connectionInProgress,
      })}
      ref={ref}
    >
      {render()}
    </div>
  );
};
