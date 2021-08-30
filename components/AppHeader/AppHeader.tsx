import React, { FC, useCallback, useState } from 'react';

import { Icon } from 'components/Icon';
import { SidebarNavigation } from 'features/sidebar-navigation';

import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  const [showSideBar, setShowSideBar] = useState(false);

  const openNavigation = useCallback(() => {
    setShowSideBar(true);
  }, [setShowSideBar]);

  const closeNavigation = useCallback(() => {
    setShowSideBar(false);
  }, [setShowSideBar]);

  function renderNavigation() {
    if (showSideBar) {
      return <SidebarNavigation fullscreen closeSideBar={closeNavigation} />;
    }

    return null;
  }

  return (
    <header className={styles.appHeader}>
      {renderNavigation()}
      <Icon
        name="hamburger"
        className={styles.hamburgerIcon}
        onClick={openNavigation}
      />
      [PLACEHOLDER] header here
    </header>
  );
};
