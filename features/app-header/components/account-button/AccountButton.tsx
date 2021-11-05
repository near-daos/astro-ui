import { useClickAway } from 'react-use';
import React, { FC, useRef, useState } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { useAuthContext } from 'context/AuthContext';
import { useDeviceType } from 'helpers/media';

import styles from './account-button.module.scss';

const NEAR_ICON = (
  <svg
    width="33"
    height="32"
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.583 1.62495L19.8058 11.5556C19.696 11.6989 19.6452 11.878 19.6637 12.0568C19.6822 12.2356 19.7686 12.4009 19.9054 12.5193C20.0423 12.6378 20.2195 12.7007 20.4015 12.6954C20.5834 12.6901 20.7566 12.617 20.8861 12.4907L27.5552 6.80183C27.5937 6.76701 27.6416 6.74411 27.6931 6.73595C27.7447 6.7278 27.7975 6.73475 27.845 6.75596C27.8926 6.77716 27.9328 6.81167 27.9606 6.85522C27.9885 6.89877 28.0028 6.94944 28.0018 7.00094V24.8818C28.0012 24.9361 27.9839 24.9889 27.9521 25.0332C27.9204 25.0775 27.8757 25.1112 27.824 25.1298C27.7723 25.1483 27.7161 25.1509 27.663 25.137C27.6098 25.1232 27.5622 25.0937 27.5264 25.0525L7.36073 1.23029C7.0388 0.847843 6.63604 0.539557 6.18069 0.327042C5.72535 0.114527 5.22843 0.00292765 4.72479 6.6742e-05H4.02259C3.1067 6.6742e-05 2.22832 0.359309 1.58068 0.998765C0.93305 1.63822 0.569214 2.50551 0.569214 3.40984V28.5902C0.569214 29.4946 0.93305 30.3618 1.58068 31.0013C2.22832 31.6408 3.1067 32 4.02259 32C4.61273 31.9999 5.193 31.8505 5.70804 31.5661C6.22308 31.2816 6.6557 30.8716 6.96462 30.3751L13.7417 20.4445C13.8515 20.3011 13.9023 20.1221 13.8838 19.9433C13.8654 19.7645 13.779 19.5992 13.6421 19.4807C13.5053 19.3622 13.328 19.2993 13.1461 19.3046C12.9641 19.31 12.791 19.3831 12.6614 19.5094L5.99234 25.1982C5.95389 25.2331 5.90594 25.256 5.85443 25.2641C5.80291 25.2723 5.75011 25.2653 5.70256 25.2441C5.65502 25.2229 5.61482 25.1884 5.58696 25.1448C5.55909 25.1013 5.54479 25.0506 5.54582 24.9991V7.13605C5.54636 7.08176 5.56367 7.02893 5.59544 6.98462C5.6272 6.94031 5.67191 6.90662 5.72358 6.88807C5.77526 6.86952 5.83144 6.86698 5.88461 6.88079C5.93778 6.89461 5.98542 6.92412 6.02115 6.96538L26.1868 30.7876C26.5112 31.1666 26.9155 31.4711 27.3714 31.6799C27.8273 31.8887 28.3238 31.9967 28.8264 31.9964H29.5466C30.0001 31.9964 30.4492 31.9082 30.8681 31.7369C31.2871 31.5655 31.6678 31.3144 31.9885 30.9977C32.3092 30.6811 32.5635 30.3052 32.7371 29.8915C32.9106 29.4778 33 29.0345 33 28.5867V3.40984C33 2.96026 32.9099 2.51512 32.735 2.10003C32.5601 1.68494 32.3038 1.3081 31.9809 0.991191C31.6579 0.674285 31.2746 0.423569 30.8532 0.253472C30.4317 0.0833747 29.9803 -0.00274605 29.525 6.6742e-05C28.9348 0.000136647 28.3546 0.149528 27.8395 0.433985C27.3245 0.718442 26.8919 1.12847 26.583 1.62495Z"
      fill="#201F1F"
    />
  </svg>
);

export const AccountButton: FC = () => {
  const { login, logout, accountId } = useAuthContext();
  const { isMobile } = useDeviceType();

  const ref = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useClickAway(ref, () => {
    setShowPopup(false);
  });

  function toggleShowPopup() {
    setShowPopup(!showPopup);
  }

  function renderSignOutPopup() {
    if (showPopup) {
      return (
        <div
          tabIndex={0}
          role="button"
          onClick={logout}
          onKeyPress={logout}
          className={styles.popup}
        >
          Sign out
        </div>
      );
    }

    return null;
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
        <span>{NEAR_ICON}</span>
        <span className={styles.name}>{accountId}</span>
        {renderSignOutPopup()}
      </div>
    );
  }

  return (
    <div className={styles.root}>
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
