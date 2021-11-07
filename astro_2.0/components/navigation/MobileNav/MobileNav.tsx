import React, { VFC } from 'react';

import { NAV_CONFIG } from 'astro_2.0/components/navigation/navConfig';
import { NavButton } from 'astro_2.0/components/navigation/NavButton';

import styles from './MobileNav.module.scss';

export const MobileNav: VFC = () => {
  const navItems = NAV_CONFIG.map(conf => {
    return <NavButton {...conf} mobile key={conf.label} />;
  });

  return <div className={styles.root}>{navItems}</div>;
};
