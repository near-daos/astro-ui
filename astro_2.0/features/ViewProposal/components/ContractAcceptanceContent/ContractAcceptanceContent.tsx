import React, { FC } from 'react';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import styles from './ContractAcceptanceContent.module.scss';

interface ContractAcceptanceContentProps {
  tokenId: string;
  unstakingPeriod: string;
}

export const ContractAcceptanceContent: FC<ContractAcceptanceContentProps> = ({
  tokenId,
  unstakingPeriod,
}) => {
  return (
    <div className={styles.root}>
      <InfoBlockWidget
        label="Token ID"
        value={tokenId}
        className={styles.row}
      />
      <InfoBlockWidget label="Unstaking Period" value={unstakingPeriod} />
    </div>
  );
};
