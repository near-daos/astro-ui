import cn from 'classnames';
import { useClickAway } from 'react-use';
import React, { FC, useRef, useState } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { NearIcon } from 'astro_2.0/components/AppHeader/components/NearIcon';

import { useDeviceType } from 'helpers/media';
import { useAuthContext } from 'context/AuthContext';

import { AccountPopup } from './components/AccountPopup';

import styles from './AccountButton.module.scss';

export const AccountButton: FC = () => {
  const { login, accountId } = useAuthContext();
  const { isMobile } = useDeviceType();

  const ref = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useClickAway(ref, () => {
    setShowPopup(false);
  });

  function toggleShowPopup() {
    setShowPopup(!showPopup);
  }

  function renderLoggedUserInfo() {
    return (
      <div
        ref={ref}
        tabIndex={0}
        role="button"
        onClick={toggleShowPopup}
        onKeyPress={toggleShowPopup}
        className={styles.loggedUserInfo}
      >
        <span>
          <NearIcon />
        </span>
        <span className={styles.name}>{accountId}</span>
        <AccountPopup show={showPopup} />
      </div>
    );
  }

  return (
    <div className={cn('near-icon-parent', styles.root)}>
      {accountId ? (
        renderLoggedUserInfo()
      ) : (
        <Button
          onClick={login}
          className={styles.auth}
          size={isMobile ? 'small' : 'medium'}
        >
          <span>Sign in </span>
          {!isMobile && (
            <span>
              with&nbsp; <Icon name="logoNear" className={styles.iconLogo} />
            </span>
          )}
        </Button>
      )}
    </div>
  );
};
