import { TransparencyIllustration } from 'features/create-dao/components/public-notice/illustration';
import { VFC } from 'react';
import styles from './public-notice.module.scss';

export const DaoPublicNotice: VFC = () => (
  <div className={styles.root}>
    <h2>Before you continue...</h2>
    <TransparencyIllustration />
    <h2>
      A DAO&apos;s rules, members, and transactions are recorded on the NEAR
      blockchain and publicly viewable by anyone.
    </h2>
  </div>
);
