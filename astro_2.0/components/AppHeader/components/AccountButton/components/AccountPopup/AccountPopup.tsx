import cn from 'classnames';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { AccountPopupItem } from './components/AccountPopupItem';

import styles from './AccountPopup.module.scss';

interface AccountPopupProps {
  show: boolean;
  closePopup: () => void;
}

export const AccountPopup: FC<AccountPopupProps> = ({ show, closePopup }) => {
  const { logout, accountId } = useAuthContext();

  const [visible, setVisible] = useState(false);
  const [canRender, setCanRender] = useState(false);

  const disconnect = useCallback(() => {
    closePopup();
    logout();
  }, [logout, closePopup]);

  useEffect(() => {
    if (show) {
      setCanRender(true);
      setTimeout(() => {
        setVisible(true);
      }, 100);
    } else {
      setVisible(false);
      setTimeout(() => {
        setCanRender(false);
      }, parseInt(styles.transitionTime, 10) * 1000 + 100);
    }
  }, [show]);

  const rootClassName = cn(styles.root, {
    [styles.visible]: visible,
  });

  if (canRender) {
    return (
      <div className={rootClassName}>
        <div className={styles.name}>{accountId}</div>
        <AccountPopupItem className={styles.auth} onClick={disconnect}>
          Disconnect
        </AccountPopupItem>
      </div>
    );
  }

  return null;
};
