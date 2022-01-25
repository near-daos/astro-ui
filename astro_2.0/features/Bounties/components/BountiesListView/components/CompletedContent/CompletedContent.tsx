import React, { FC } from 'react';

import styles from './CompletedContent.module.scss';

interface CompletedContentProps {
  slots: number;
  slotsTotal: number;
}

export const CompletedContent: FC<CompletedContentProps> = ({
  slots,
  slotsTotal,
}) => {
  return (
    <div className={styles.root}>
      <span className={styles.slotsWrapper}>
        <span className={styles.slotActive}>{slots}</span>
        <span className={styles.slot}> / {slotsTotal}</span>
      </span>
    </div>
  );
};
