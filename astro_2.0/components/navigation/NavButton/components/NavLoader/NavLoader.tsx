import { VFC } from 'react';

import styles from './NavLoader.module.scss';

export const NavLoader: VFC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.p1} />
      <div className={styles.p2} />
      <div className={styles.p3} />
      <div className={styles.p4} />
    </div>
  );
};
