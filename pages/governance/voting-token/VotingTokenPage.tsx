import React, { FC } from 'react';
import { Button } from 'components/button/Button';

import styles from './voting-token-page.module.scss';

const VotingTokenPage: FC = () => {
  return (
    <>
      <div className={styles.header}>
        <h1>Enable voting by token</h1>
        <Button size="small" variant="secondary">
          Start
        </Button>
      </div>
    </>
  );
};

export default VotingTokenPage;
