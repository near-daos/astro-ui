import { FC } from 'react';

import styles from './CardFooter.module.scss';

export const CardFooter: FC = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};
