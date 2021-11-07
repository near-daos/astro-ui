import { useClickAway } from 'react-use';
import React, { FC, useCallback, useRef, useState } from 'react';

import { NearIcon } from 'astro_2.0/components/AppHeader/components/NearIcon';

import { useAuthContext } from 'context/AuthContext';

import { AccountPopup } from './components/AccountPopup';

import styles from './AccountButton.module.scss';

export const AccountButton: FC = () => {
  const { login, accountId } = useAuthContext();

  const ref = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  useClickAway(ref, () => {
    closePopup();
  });

  const onNearClick = useCallback(() => {
    if (accountId) {
      setShowPopup(!showPopup);
    } else {
      login();
    }
  }, [login, showPopup, accountId]);

  return (
    <div className={styles.root} ref={ref}>
      <NearIcon black={!!accountId} onClick={onNearClick} />
      <AccountPopup show={showPopup} closePopup={closePopup} />
    </div>
  );
};
