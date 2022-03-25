import cn from 'classnames';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { Icon } from 'components/Icon';
import { NearIcon } from 'astro_2.0/components/NearIcon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { WalletType } from 'types/config';
import { WalletDescription } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletDescription';
import { AccountPopupItem } from './components/AccountPopupItem';

import styles from './AccountButton.module.scss';

export const AccountButton: FC = () => {
  const [open, setOpen] = useState(false);
  const [senderWalletAvailable, setSenderWalletAvailable] = useState(false);
  const { login, logout, accountId, switchWallet } = useAuthContext();

  const switchWalletHandler = useCallback(
    async (wallet: WalletType) => {
      await logout();
      await switchWallet(wallet);
      await login();
    },
    [logout, login, switchWallet]
  );

  const ref = useRef(null);
  const counter = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (counter.current !== undefined && counter.current === 10) {
        clearInterval(intervalId);

        return;
      }

      if (counter.current !== undefined) {
        counter.current += 1;
      }

      if (typeof window.near !== 'undefined' && window.near.isSender) {
        setSenderWalletAvailable(true);
        clearInterval(intervalId);
      }
    }, 500);
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  function renderNearIcon() {
    if (accountId) {
      return (
        <GenericDropdown
          isOpen={open}
          onOpenUpdate={setOpen}
          parent={
            <div className={styles.accountButton}>
              <NearIcon />
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
          <div>
            <div className={styles.dropdown}>
              <AccountPopupItem
                content={<div className={styles.text}>My Account</div>}
                icon={<Icon name="account" className={styles.icon} />}
              />

              {senderWalletAvailable && (
                <>
                  <div className={styles.delimiter} />

                  <div className={styles.chooseWalletCaption}>
                    Choose wallet
                  </div>

                  <AccountPopupItem
                    icon={
                      <div className={styles.iconContainer}>
                        <Icon name="tokenNearBig" />
                        {window.nearService.getWalletType() ===
                          WalletType.NEAR && (
                          <div className={styles.selectedWallet} />
                        )}
                      </div>
                    }
                    content={
                      <WalletDescription
                        name="NEAR"
                        type="web"
                        url="wallet.near.org"
                      />
                    }
                    onClick={() => switchWalletHandler(WalletType.NEAR)}
                    className={styles.row}
                  />
                  <AccountPopupItem
                    icon={
                      <div className={styles.iconContainer}>
                        <Icon name="senderWallet" />
                        {window.nearService.getWalletType() ===
                          WalletType.SENDER && (
                          <div className={styles.selectedWallet} />
                        )}
                      </div>
                    }
                    content={
                      <WalletDescription
                        name="Sender"
                        type="extension"
                        url="senderwallet.io"
                      />
                    }
                    onClick={() => switchWalletHandler(WalletType.SENDER)}
                    className={styles.row}
                  />
                  <div className={styles.delimiter} />
                </>
              )}
              <AccountPopupItem
                onClick={logout}
                content={
                  <div className={styles.disconnectText}>Disconnect</div>
                }
                icon={
                  <Icon
                    name="logout"
                    className={cn(
                      styles.disconnect,
                      styles.icon,
                      styles.disconnectIconColor
                    )}
                  />
                }
              />
            </div>
            <AppFooter mobile className={styles.footer} onClick={closePopup} />
          </div>
        </GenericDropdown>
      );
    }

    return <NearIcon onClick={login} />;
  }

  return (
    <div className={styles.root} ref={ref}>
      {renderNearIcon()}
    </div>
  );
};
