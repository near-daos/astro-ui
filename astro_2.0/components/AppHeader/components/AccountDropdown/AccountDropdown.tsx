import { useWalletContext } from 'context/WalletContext';
import React, { useCallback, useRef, useState } from 'react';
import { LoginButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/LoginButton';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import { WalletsList } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { ConnectedAccountButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/ConnectedAccountButton';
import styles from './AccountDropdown.module.scss';

export const AccountDropdown: React.FC = () => {
  const { accountId, nearService } = useWalletContext();
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
      <div className={styles.wrapper}>
        <GenericDropdown
          isOpen={open}
          onOpenUpdate={setOpen}
          parent={
            <div>
              <Icon name="settings" className={cn(styles.controlIcon)} />
            </div>
          }
          options={{
            placement: 'bottom-end',
          }}
        >
          <>
            {nearService && (
              <WalletsList closeDropdownHandler={closeDropdown} />
            )}
            <AppFooter
              mobile
              className={styles.footer}
              onClick={closeDropdown}
            />
          </>
        </GenericDropdown>
        <ConnectedAccountButton />
      </div>
    );
  }

  return (
    <div className={cn(styles.root)} ref={ref}>
      {render()}
    </div>
  );
};
