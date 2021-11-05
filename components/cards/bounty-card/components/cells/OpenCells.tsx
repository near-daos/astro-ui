import React, { FC } from 'react';

import { Button } from 'components/button/Button';

import styles from 'components/cards/bounty-card/bounty-card.module.scss';

interface OpenCellProps {
  claimed: number;
  slots: number;
  onClaim?: () => void;
}

export const OpenCells: FC<OpenCellProps> = ({ claimed, slots, onClaim }) => (
  <>
    <div className={styles.slots}>
      <span>{`${claimed}/${slots}`}</span>
    </div>
    <div className={styles.control}>
      <Button
        variant="secondary"
        size="block"
        className={styles.claim}
        onClick={onClaim}
        disabled={claimed === slots}
      >
        Claim
      </Button>
    </div>
  </>
);
