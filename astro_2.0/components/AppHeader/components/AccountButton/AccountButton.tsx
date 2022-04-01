import cn from 'classnames';
import React, { FC, useCallback, useRef, useState } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { Icon } from 'components/Icon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { WalletType } from 'types/config';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletIcon/WalletIcon';
import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/DisconnectButton';
import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/MyAccount';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';

import { useModal } from 'components/modal';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletSelectionModal';
import styles from './AccountButton.module.scss';

export const AccountButton: FC = () => {
  const [open, setOpen] = useState(false);
  const { login, logout, accountId, nearService } = useAuthContext();

  const [showModal] = useModal(WalletSelectionModal, {
    signIn: walletType => login(walletType),
  });

  const closePopup = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const switchWalletHandler = useCallback(
    (wallet: WalletType) => async () => {
      await login(wallet);
      setOpen(false);
    },
    [login, setOpen]
  );

  const ref = useRef(null);

  function render() {
    if (!accountId) {
      return (
        <WalletIcon
          walletType={WalletType.NEAR}
          isSelected={false}
          onClick={showModal}
        />
      );
    }

    return (
      <GenericDropdown
        isOpen={open}
        onOpenUpdate={setOpen}
        parent={
          <div className={styles.accountButton}>
            <WalletIcon
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
        <div>
          <div className={styles.dropdown}>
            <MyAccountButton className={styles.menuButton} />

            {nearService && (
              <>
                <div className={styles.delimiter} />
                <div className={styles.chooseWalletCaption}>Choose wallet</div>
                <WalletButton
                  walletType={WalletType.NEAR}
                  isSelected={nearService.getWalletType() === WalletType.NEAR}
                  onClick={switchWalletHandler(WalletType.NEAR)}
                  name="NEAR"
                  type="web"
                  url="wallet.near.org"
                />
                <WalletButton
                  disabled={
                    !(window.near !== undefined && window.near.isSender)
                  }
                  walletType={WalletType.SENDER}
                  isSelected={nearService.getWalletType() === WalletType.SENDER}
                  onClick={switchWalletHandler(WalletType.SENDER)}
                  name="Sender"
                  type="extension"
                  url="senderwallet.io"
                />

                <div className={styles.delimiter} />
              </>
            )}
            <DisconnectButton logout={logout} />
          </div>
          <AppFooter mobile className={styles.footer} onClick={closePopup} />
        </div>
      </GenericDropdown>
    );
  }

  return (
    <div className={styles.root} ref={ref}>
      {render()}
    </div>
  );
};
