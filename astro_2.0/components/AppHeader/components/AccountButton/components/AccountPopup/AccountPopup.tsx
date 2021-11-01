import cn from 'classnames';
import React, { FC, useEffect, useState } from 'react';

import { CREATE_DAO_URL, MY_DAOS_URL, MY_FEED_URL } from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { AccountPopupItem } from './components/AccountPopupItem';

import styles from './AccountPopup.module.scss';

interface AccountPopupProps {
  show: boolean;
}

export const AccountPopup: FC<AccountPopupProps> = ({ show }) => {
  const { logout } = useAuthContext();

  const [visible, setVisible] = useState(false);
  const [canRender, setCanRender] = useState(false);

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
        <AccountPopupItem href={MY_DAOS_URL}>My DAOs</AccountPopupItem>
        <AccountPopupItem href={MY_FEED_URL}>My Feed</AccountPopupItem>
        <div className={styles.delimiter} />
        <AccountPopupItem href={CREATE_DAO_URL}>
          Create New DAO
        </AccountPopupItem>
        <div className={styles.delimiter} />
        <AccountPopupItem className={styles.auth} onClick={logout}>
          Disconnect
        </AccountPopupItem>
      </div>
    );
  }

  return null;
};
