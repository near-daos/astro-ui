import React, { FC } from 'react';
import Link from 'next/link';

import styles from 'pages/dao/[dao]/governance/upgrade-software/upgrade-software-page.module.scss';

const UpgradeSoftwarePage: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Upgrade software</h1>
      </div>
      <div className={styles.subheader}>
        View the latest updates{' '}
        <Link href="http://example.com" passHref>
          <a className={styles.link}>here</a>
        </Link>
      </div>
    </div>
  );
};

export default UpgradeSoftwarePage;
