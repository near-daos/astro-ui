import React, { FC } from 'react';
import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/DelegatePageContent.module.scss';
import { Button } from 'components/button/Button';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';

interface Props {
  onClick: () => void;
}

export const QuorumErrorWarning: FC<Props> = ({ onClick }) => {
  return (
    <DaoWarning
      className={styles.warning}
      content={
        <>
          <div className={styles.title}>
            The number of delegated tokens is not enough to make a decision
          </div>
          <div className={styles.text}>
            Distribute more tokens among members or edit Amount tokens to accept
            proposal
          </div>
        </>
      }
      control={
        <Button capitalize variant="primary" onClick={onClick}>
          Create proposal to edit
        </Button>
      }
    />
  );
};
