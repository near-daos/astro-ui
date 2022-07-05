import cn from 'classnames';
import React, { useCallback, useRef, useState } from 'react';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

import { Icon } from 'components/Icon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { LoginButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/LoginButton';
import { WalletsList } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList';
import { ConnectedAccountButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/ConnectedAccountButton';

import styles from './AccountDropdown.module.scss';

export const AccountDropdown: React.FC = () => {
  const { accountId, connecting } = useWalletSelectorContext();

  const [open, setOpen] = useState(false);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const ref = useRef(null);

  function render() {
    if (!accountId) {
      return <LoginButton />;
    }

    return (
      <GenericDropdown
        isOpen={open}
        onOpenUpdate={setOpen}
        parent={
          <div>
            <ConnectedAccountButton>
              <Icon
                name="buttonArrowDown"
                className={cn(styles.controlIcon, { [styles.open]: open })}
              />
            </ConnectedAccountButton>
          </div>
        }
        options={{
          placement: 'bottom-end',
        }}
      >
        <>
          <WalletsList />
          <AppFooter mobile className={styles.footer} onClick={closeDropdown} />
        </>
      </GenericDropdown>
    );
  }

  return (
    <div
      className={cn(styles.root, {
        [styles.disabled]: connecting,
      })}
      ref={ref}
    >
      {render()}
    </div>
  );
};
