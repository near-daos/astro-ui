import React, { FC } from 'react';
import Link from 'next/link';

import { Button } from 'components/button/Button';

import styles from './upgrade-software-page.module.scss';

const UpgradeSoftwarePage: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Upgrade software</h1>
      </div>
      <div className={styles.subheader}>
        View the latest updates{' '}
        <Link href="http://example.com" passHref>
          <Button variant="tertiary" className={styles.link}>
            here
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpgradeSoftwarePage;
