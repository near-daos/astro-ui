import { VFC } from 'react';

import styles from './NavLoader.module.scss';

export const NavLoader: VFC = () => {
  return (
    <div className={styles.root}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
