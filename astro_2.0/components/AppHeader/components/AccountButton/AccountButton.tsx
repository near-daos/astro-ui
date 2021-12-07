import cn from 'classnames';
import React, { FC, useCallback, useRef, useState } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { Icon } from 'components/Icon';
import { NearIcon } from 'astro_2.0/components/NearIcon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { AccountPopupItem } from './components/AccountPopupItem';

import styles from './AccountButton.module.scss';

export const AccountButton: FC = () => {
  const [open, setOpen] = useState(false);
  const { login, logout, accountId } = useAuthContext();

  const ref = useRef(null);

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
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 24],
                },
              },
            ],
          }}
        >
          <div>
            <div className={styles.dropdown}>
              <div className={styles.name}>{accountId}</div>
              <AccountPopupItem className={styles.auth} onClick={logout}>
                Disconnect
              </AccountPopupItem>
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
