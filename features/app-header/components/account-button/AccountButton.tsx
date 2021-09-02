import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { useAuthContext } from 'context/AuthContext';
import { useDeviceType } from 'helpers/media';

import styles from './account-button.module.scss';

const SMILE = (
  <svg
    width="43"
    height="43"
    viewBox="0 0 43 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="21.6738" cy="21.0405" r="21" fill="#E1FC31" />
    <path
      d="M34.7988 21.0405C34.7988 28.2893 28.9226 34.1655 21.6738 34.1655C14.4251 34.1655 8.54883 28.2893 8.54883 21.0405"
      stroke="#201F1F"
      strokeWidth="1.5"
    />
  </svg>
);

export const AccountButton: FC = () => {
  const { login, accountId } = useAuthContext();
  const { isMobile } = useDeviceType();

  return (
    <div className={styles.root}>
      {accountId ? (
        <>
          <span>{SMILE}</span>
          <span className={styles.name}>{accountId}</span>
        </>
      ) : (
        <Button size={isMobile ? 'small' : 'medium'} onClick={login}>
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
