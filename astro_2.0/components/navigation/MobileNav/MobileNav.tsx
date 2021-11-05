import React, { VFC } from 'react';

import { NAV_CONFIG } from 'astro_2.0/components/navigation/navConfig';
import { NavButton } from 'astro_2.0/components/navigation/NavButton';

import styles from './MobileNav.module.scss';

export const MobileNav: VFC = () => {
  function renderNavItems() {
    return NAV_CONFIG.map(conf => {
      const { icon, hoverIcon, href, label } = conf;

      return (
        <NavButton
          mobile
          icon={icon}
          href={href}
          key={label}
          hoverIcon={hoverIcon}
        >
          {label}
        </NavButton>
      );
    });
  }

  return <div className={styles.root}>{renderNavItems()}</div>;
};
